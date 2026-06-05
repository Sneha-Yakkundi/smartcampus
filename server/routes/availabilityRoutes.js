const express = require("express");

const router = express.Router();

const {
    getAvailableResources
} = require("../controllers/availabilityController");

router.get("/", getAvailableResources);

module.exports = router;