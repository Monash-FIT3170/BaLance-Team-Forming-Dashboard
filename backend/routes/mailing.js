const express = require("express");
const router = express.Router();
const {
    getStudentEmails,
    sendEmails
} = require("../routeHandlers/mailingRouteHandler");

// get all students emails from a unit
router.get("/:unitCode/:year/:period", getStudentEmails);

router.post("/:unitCode/:year/:period", sendEmails);


// export this router for external use
module.exports = router;
