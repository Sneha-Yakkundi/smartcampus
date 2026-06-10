const Resource = require("../models/Resource");
const Booking = require("../models/Booking");

exports.getStats = async (req, res) => {

    try {

        const totalResources = await Resource.count();

        const totalBookings = await Booking.count();

        const pendingBookings = await Booking.count({
            where: { status: "pending" }
        });

        const approvedBookings = await Booking.count({
            where: { status: "approved" }
        });

        res.json({
            totalResources,
            totalBookings,
            pendingBookings,
            approvedBookings
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// NEW ANALYTICS API
exports.getAnalytics = async (req, res) => {

    try {

        const pending = await Booking.count({
            where: {
                approvalStatus: "pending"
            }
        });

        const approved = await Booking.count({
            where: {
                approvalStatus: "approved"
            }
        });

        const rejected = await Booking.count({
            where: {
                approvalStatus: "rejected"
            }
        });

        res.json({
            pending,
            approved,
            rejected
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};