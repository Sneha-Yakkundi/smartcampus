const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBooking,
    getBookings,
    cancelBooking,
    updateBookingStatus,
    getPendingBookings,
    approveBooking,
    rejectBooking
} = require("../controllers/bookingController");


// CREATE BOOKING
router.post("/", authMiddleware, createBooking);

// GET BOOKINGS (user's bookings)
router.get("/", authMiddleware, getBookings);

// FEATURE 5: ADMIN APPROVAL WORKFLOW
router.get("/pending", authMiddleware, getPendingBookings);
router.put("/:bookingId/approve", authMiddleware, approveBooking);
router.put("/:bookingId/reject", authMiddleware, rejectBooking);

// CANCEL BOOKING
router.put("/:id/cancel", authMiddleware, cancelBooking);

// UPDATE STATUS
router.put("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;