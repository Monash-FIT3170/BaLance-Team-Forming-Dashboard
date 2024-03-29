const express = require("express");
const router = express.Router();
const {
    getAllGroups,
    getLabNumber,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
} = require("../routeHandlers/groupRouteHandler");

const { uploadCustomScript } = require("../routeHandlers/scriptRouteHandler");

// get all groups for a specific unit
router.get("/:unitCode/:year/:period", getAllGroups);

// get the lab number for a specific offering's group
router.get("/:unitCode/:year/:period/labNumber/:groupNumber", getLabNumber);

// create unit groups
router.post("/:unitCode/:year/:period", createUnitGroups);

// shuffle unit groups
router.post("/shuffle/:unitCode/:year/:period", shuffleUnitGroups);

router.post("/:unitCode/:year/:period/uploadScript", uploadCustomScript);

// move a student between two groups
router.patch("/:unitCode/:year/:period/move/:studentId/:hasAGroup", moveStudent);

// export this router for external use
module.exports = router;
