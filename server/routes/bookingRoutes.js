const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBooking,
    getBookings,
    cancelBooking,
    updateBookingStatus
} = require("../controllers/bookingController");


// CREATE BOOKING
router.post("/", authMiddleware, createBooking);

// GET BOOKINGS
router.get("/", authMiddleware, getBookings);

// CANCEL BOOKING
router.put("/:id/cancel", authMiddleware, cancelBooking);

// UPDATE STATUS
router.put("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;