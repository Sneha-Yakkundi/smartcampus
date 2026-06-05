const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    getAllUsers,
    promoteToAdmin,
    demoteToStudent
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);

// Admin management routes (protected with authMiddleware - checks role inside controller)
router.get("/users", authMiddleware, getAllUsers);
router.put("/promote", authMiddleware, promoteToAdmin);
router.put("/demote", authMiddleware, demoteToStudent);

module.exports = router;