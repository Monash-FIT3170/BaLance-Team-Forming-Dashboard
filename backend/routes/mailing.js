const express = require("express");
const router = express.Router();
const {
    getStudentEmails
} = require("../routeHandlers/mailingRouteHandler");

// get all students emails from a unit
router.get("/:unitCode/:year/:period", getStudentEmails);

// export this router for external use
module.exports = router;
