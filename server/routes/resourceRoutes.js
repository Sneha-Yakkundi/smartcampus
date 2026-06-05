const express = require("express");
const router = express.Router();

const {
    createResource,
    getResources,
    searchResources,
    getResourceAvailability,
    setMaintenanceStatus,
    getResourceById,
    deleteResource
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");

// PROTECTED ROUTES
router.post("/", authMiddleware, createResource);
router.get("/", authMiddleware, getResources);

// FEATURE 1: SEARCH AND FILTER
router.get("/search", authMiddleware, searchResources);

// FEATURE 2: GET AVAILABILITY SLOTS
router.get("/availability", authMiddleware, getResourceAvailability);

// FEATURE 4: MAINTENANCE STATUS
router.put("/maintenance/:resourceId", authMiddleware, setMaintenanceStatus);

// GET BY ID
router.get("/:id", authMiddleware, getResourceById);

// DELETE
router.delete("/:id", authMiddleware, deleteResource);

module.exports = router;