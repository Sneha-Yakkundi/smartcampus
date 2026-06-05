const Resource = require("../models/Resource");
const Booking = require("../models/Booking");
const { Op } = require("sequelize");

// CREATE RESOURCE
exports.createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.json(resource);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET ALL RESOURCES
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (err) {
        res.status(500).json(err);
    }
};

// FEATURE 1: SEARCH AND FILTER RESOURCES
exports.searchResources = async (req, res) => {
    try {
        const { type, building, floor, capacity, department, search, availability, date, startTime, endTime } = req.query;
        
        let whereClause = { status: "available" };  // Only show available resources

        // Filter by type
        if (type) {
            whereClause.type = type;
        }

        // Filter by building
        if (building) {
            whereClause.building = building;
        }

        // Filter by floor
        if (floor) {
            whereClause.floor = parseInt(floor);
        }

        // Filter by capacity (greater than or equal to requested)
        if (capacity) {
            whereClause.capacity = { [Op.gte]: parseInt(capacity) };
        }

        // Filter by department
        if (department) {
            whereClause.department = department;
        }

        // Search by name or location (text search)
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } }
            ];
        }

        let resources = await Resource.findAll({ where: whereClause });

        // If checking availability for specific date/time, filter conflicts
        if (date && startTime && endTime) {
            const bookedResources = await Booking.findAll({
                where: {
                    date: date,
                    startTime: { [Op.lt]: endTime },  // Booking starts before our end time
                    endTime: { [Op.gt]: startTime },  // Booking ends after our start time
                    approvalStatus: "approved"  // Only approved bookings block time
                }
            });

            const bookedResourceIds = bookedResources.map(b => b.resourceId);
            resources = resources.filter(r => !bookedResourceIds.includes(r.id));
        }

        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FEATURE 2: GET CONFLICT INFORMATION (When is resource available next?)
exports.getResourceAvailability = async (req, res) => {
    try {
        const { resourceId, date } = req.query;

        if (!resourceId || !date) {
            return res.status(400).json({ error: "resourceId and date are required" });
        }

        // Get all bookings for this resource on this date
        const bookings = await Booking.findAll({
            where: {
                resourceId: parseInt(resourceId),
                date: date,
                approvalStatus: "approved"
            },
            order: [["startTime", "ASC"]]
        });

        // Find next available time slot
        let availableSlots = [];
        const dayStart = "08:00";  // Campus starts at 8 AM
        const dayEnd = "18:00";    // Campus closes at 6 PM

        if (bookings.length === 0) {
            availableSlots.push({ start: dayStart, end: dayEnd, available: true });
        } else {
            // Slot before first booking
            if (bookings[0].startTime > dayStart) {
                availableSlots.push({ start: dayStart, end: bookings[0].startTime, available: true });
            }

            // Slots between bookings
            for (let i = 0; i < bookings.length - 1; i++) {
                availableSlots.push({
                    start: bookings[i].endTime,
                    end: bookings[i + 1].startTime,
                    available: true
                });
            }

            // Slot after last booking
            if (bookings[bookings.length - 1].endTime < dayEnd) {
                availableSlots.push({
                    start: bookings[bookings.length - 1].endTime,
                    end: dayEnd,
                    available: true
                });
            }

            // Occupied slots
            bookings.forEach(booking => {
                availableSlots.push({
                    start: booking.startTime,
                    end: booking.endTime,
                    available: false,
                    bookedBy: booking.userId
                });
            });
        }

        // Sort by time
        availableSlots.sort((a, b) => a.start.localeCompare(b.start));

        res.json({ resourceId, date, slots: availableSlots });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FEATURE 4: MARK RESOURCE AS UNDER MAINTENANCE
exports.setMaintenanceStatus = async (req, res) => {
    try {
        const { resourceId, maintenanceStatus, notes } = req.body;

        if (!resourceId) {
            return res.status(400).json({ error: "resourceId is required" });
        }

        const resource = await Resource.findByPk(resourceId);
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }

        resource.status = maintenanceStatus === "true" || maintenanceStatus === true ? "under-maintenance" : "available";
        resource.maintenanceNotes = notes || null;
        await resource.save();

        res.json({ message: "Maintenance status updated", resource });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET RESOURCE BY ID
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        res.json(resource);
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE RESOURCE
exports.deleteResource = async (req, res) => {
    try {
        await Resource.destroy({ where: { id: req.params.id } });
        res.json({ message: "Resource deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};