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

// FEATURE 1: AI-BASED RESOURCE RECOMMENDATION
exports.getRecommendedResources = async (req, res) => {
    try {
        const { date, startTime, endTime, capacity, type, department } = req.query;
        const userId = req.user.id;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: "date, startTime, and endTime are required" });
        }

        // Step 1: Find all available resources matching filters
        let whereClause = { status: "available" };
        
        if (type) whereClause.type = type;
        if (department) whereClause.department = department;
        if (capacity) whereClause.capacity = { [Op.gte]: parseInt(capacity) };

        let availableResources = await Resource.findAll({ where: whereClause });

        // Step 2: Filter out resources with time conflicts
        const bookedResources = await Booking.findAll({
            where: {
                date: date,
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gt]: startTime },
                approvalStatus: "approved"
            }
        });

        const bookedResourceIds = bookedResources.map(b => b.resourceId);
        availableResources = availableResources.filter(r => !bookedResourceIds.includes(r.id));

        // Step 3: Score each resource based on AI logic
        const scoredResources = await Promise.all(
            availableResources.map(async (resource) => {
                let score = 100;  // Base score

                // Factor 1: Less occupied resources get higher score (-10 for each booking)
                const totalBookings = await Booking.count({
                    where: { resourceId: resource.id, approvalStatus: "approved" }
                });
                score -= (totalBookings * 10);

                // Factor 2: Capacity match (prefer resources with capacity closer to need)
                if (capacity) {
                    const capacityDiff = Math.abs(resource.capacity - parseInt(capacity));
                    score -= (capacityDiff * 2);  // Penalize oversized resources
                }

                // Factor 3: User's previous bookings in this resource (+20 points - user is familiar)
                const userPreviousBookings = await Booking.count({
                    where: { resourceId: resource.id, userId: userId }
                });
                if (userPreviousBookings > 0) {
                    score += 20;
                }

                // Factor 4: Department match (+15 if matching user's department)
                if (department && resource.department === department) {
                    score += 15;
                }

                // Factor 5: Building proximity (prefer building B over A, etc - simplified)
                // This could be enhanced with actual location data

                return {
                    ...resource.toJSON(),
                    recommendationScore: score,
                    reason: score >= 100 ? "Excellent choice - less occupied" : 
                           score >= 80 ? "Good availability" :
                           "Available but higher demand"
                };
            })
        );

        // Step 4: Sort by recommendation score
        scoredResources.sort((a, b) => b.recommendationScore - a.recommendationScore);

        res.json({
            message: "Recommended resources based on availability and usage",
            count: scoredResources.length,
            resources: scoredResources.slice(0, 5)  // Return top 5 recommendations
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};