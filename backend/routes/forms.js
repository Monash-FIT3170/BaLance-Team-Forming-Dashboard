const express = require("express");
const {
    pushData
} = require("../routeHandlers/formsRouteHandler");

const router = express.Router();

// tell backend to push form data to database
router.post("/:unitCode/:year/:period/", pushData);

module.exports = router;
