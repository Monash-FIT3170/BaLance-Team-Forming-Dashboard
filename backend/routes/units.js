/**
 * A module containing route handlers for unit related API calls
 *
 */

const express = require("express");
const router = express.Router();
const {
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    uploadCustomScript,
    verifyAvailableGroupFormationStrats
} = require("../routeHandlers/unitRouteHandler");

const { upload } = require("../middleware/uploadMiddleware");

// get all units for a user
router.get("/", getAllUnits);

// get a specific unit for a user
router.get("/:unitCode/:year/:period", getUnit);

// verify available analytics
router.get("/groupingStrategies/:unitCode/:year/:period/", verifyAvailableGroupFormationStrats);

// does not fit here fixme
router.post("/:unitCode/:year/:period/uploadScript", upload.single("pythonFile"), uploadCustomScript);

// add a new unit for the user
router.post("/", addUnit);

// delete a specific unit for a user
router.delete("/:unitCode/:year/:period", deleteUnit);

module.exports = router;
