const express = require("express");

const router = express.Router();

const {
    getStats,
    getAnalytics
} = require("../controllers/dashboardController");

router.get("/stats", getStats);

router.get("/analytics", getAnalytics);

module.exports = router;