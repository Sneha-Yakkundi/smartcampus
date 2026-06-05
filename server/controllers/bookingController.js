const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const Resource = require("../models/Resource");
const io = require("../server");
const QRCode = require("qrcode");
const { Op } = require("sequelize");


// HELPER: Get priority based on user role
const getPriority = (userRole) => {
    if (userRole === "faculty") return 2;  // Faculty has higher priority
    if (userRole === "student") return 1;  // Student has lower priority
    return 0;  // Admin (lowest booking priority but highest approval power)
};

// CREATE BOOKING (with department-based access and priority)
exports.createBooking = async (req, res) => {

    try {

        const {
            resourceId,
            date,
            startTime,
            endTime
        } = req.body;

        // Get user and resource info
        const user = await User.findByPk(req.user.id);
        const resource = await Resource.findByPk(resourceId);

        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }

        // FEATURE 6: Department-based access check
        if (resource.department && resource.department !== user.department) {
            return res.status(403).json({
                error: `This resource is restricted to ${resource.department} department`
            });
        }

        // Check if resource is under maintenance
        if (resource.status === "under-maintenance") {
            return res.status(400).json({
                error: `This resource is under maintenance. ${resource.maintenanceNotes || ""}`
            });
        }

        // GET EXISTING APPROVED BOOKINGS ONLY
        const existingBookings = await Booking.findAll({
            where: {
                resourceId,
                date,
                approvalStatus: "approved"  // Only approved bookings block time
            }
        });

        // CHECK TIME CONFLICT
        const isConflict = existingBookings.some((booking) => {
            const existingStart = booking.startTime;
            const existingEnd = booking.endTime;

            return (
                startTime < existingEnd &&
                endTime > existingStart
            );
        });

        if (isConflict) {
            // FEATURE 2: Provide next available time
            const nextAvailable = existingBookings
                .map(b => b.endTime)
                .sort()
                .shift();
            
            return res.status(400).json({
                error: "This slot is already booked",
                nextAvailable: nextAvailable || "Check availability",
                message: `This room is occupied during this time. Available again after ${nextAvailable || "later"}`
            });
        }

        // CREATE BOOKING with FEATURE 5: Approval Workflow
        const booking = await Booking.create({
            userId: req.user.id,
            resourceId,
            date,
            startTime,
            endTime,
            approvalStatus: "pending",  // Starts as pending
            priority: getPriority(user.role)  // FEATURE 7: Set priority based on role
        });

        // GENERATE QR CODE WITH BOOKING ID
        const qrData = `Booking ID: ${booking.id}\nDate: ${date}\nTime: ${startTime} - ${endTime}`;
        const qrCode = await QRCode.toDataURL(qrData);

        booking.qrCode = qrCode;
        await booking.save();

        // SEND EMAIL
        await sendEmail(
            user.email,
            "Booking Created - Pending Approval",
            `Your booking for resource ${resource.name} is pending admin approval.\nDate: ${date}\nTime: ${startTime} - ${endTime}`
        );

        io.emit("newBooking", {
            message: "New booking created and pending approval"
        });

        res.json({
            message: "Booking created successfully and is pending approval",
            booking
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// GET BOOKINGS (for user)
exports.getBookings = async (req, res) => {

    try {

        const bookings = await Booking.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: Resource,
                    attributes: ["id", "name", "type", "location"]
                }
            ]
        });

        res.json(bookings);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};


// FEATURE 5: GET ALL PENDING BOOKINGS (for admin approval)
exports.getPendingBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                approvalStatus: "pending"
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email", "role", "department"]
                },
                {
                    model: Resource,
                    attributes: ["id", "name", "type", "location", "building", "floor", "capacity", "department"]
                }
            ],
            order: [["priority", "DESC"], ["createdAt", "ASC"]]  // Sort by priority (faculty first) then by creation time
        });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FEATURE 5: APPROVE BOOKING
exports.approveBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { adminNotes } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        booking.approvalStatus = "approved";
        booking.status = "approved";
        booking.adminNotes = adminNotes || null;
        await booking.save();

        // Notify user
        const user = await User.findByPk(booking.userId);
        await sendEmail(
            user.email,
            "Booking Approved",
            `Your booking has been approved.\nAdmin Notes: ${adminNotes || "None"}`
        );

        res.json({ message: "Booking approved", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FEATURE 5: REJECT BOOKING
exports.rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { adminNotes } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        booking.approvalStatus = "rejected";
        booking.status = "rejected";
        booking.adminNotes = adminNotes || null;
        await booking.save();

        // Notify user
        const user = await User.findByPk(booking.userId);
        await sendEmail(
            user.email,
            "Booking Rejected",
            `Your booking has been rejected.\nReason: ${adminNotes || "No reason provided"}`
        );

        res.json({ message: "Booking rejected", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {

    try {

        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        booking.status = "cancelled";
        booking.approvalStatus = "cancelled";

        await booking.save();

        res.json({
            message: "Booking cancelled successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

}

};


// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const booking = await Booking.findByPk(id);

        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }

        booking.status = status;

        await booking.save();

        // GET USER
        const user = await User.findByPk(booking.userId);

        // SEND EMAIL
        await sendEmail(

            user.email,

            "Booking Status Updated",

            `Your booking has been ${status}`

        );

        res.json({

            message: "Booking status updated",

            booking

        });

    } catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

};