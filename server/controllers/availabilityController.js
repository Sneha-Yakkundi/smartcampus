const Resource = require("../models/Resource");
const Booking = require("../models/Booking");

const { Op } = require("sequelize");

// GET AVAILABLE RESOURCES
exports.getAvailableResources = async (req, res) => {

    try {

        const {
            date,
            startTime,
            endTime
        } = req.query;

        // FIND CONFLICT BOOKINGS
        const bookedResources = await Booking.findAll({

            where: {

                date,

                [Op.or]: [

                    {
                        startTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },

                    {
                        endTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    }

                ]

            }

        });

        // GET BOOKED RESOURCE IDS
        const bookedIds = bookedResources.map(
            booking => booking.resourceId
        );

        // FIND AVAILABLE RESOURCES
        const availableResources = await Resource.findAll({

            where: {

                id: {
                    [Op.notIn]: bookedIds
                }

            }

        });

        res.json(availableResources);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};