const Resource = require("../models/Resource");
const Booking = require("../models/Booking");

exports.getStats = async (req, res) => {

    try {

        const totalResources =
            await Resource.count();

        const totalBookings =
            await Booking.count();

        const pendingBookings =
            await Booking.count({
                where: {
                    status: "pending"
                }
            });

        const approvedBookings =
            await Booking.count({
                where: {
                    status: "approved"
                }
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