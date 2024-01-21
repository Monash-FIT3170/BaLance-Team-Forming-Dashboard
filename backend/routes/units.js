/**
 * This module specifies routes for unit related API calls
 *
 */

const express = require("express");
const router = express.Router();
const {
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    verifyAvailableGroupFormationStrats
} = require("../routeHandlers/unitRouteHandler");

// gets all units for a user
router.get("/", getAllUnits);

// gets a specific unit for a user
router.get("/:unitCode/:year/:period", getUnit);

// verifies which grouping strategies a unit currently supports
router.get("/groupingStrategies/:unitCode/:year/:period/", verifyAvailableGroupFormationStrats);

// adds a new unit for the user
router.post("/", addUnit);

// deletes a specific unit for a user
router.delete("/:unitCode/:year/:period", deleteUnit);

module.exports = router;
