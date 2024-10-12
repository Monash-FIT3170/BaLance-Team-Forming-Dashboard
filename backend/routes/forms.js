const express = require("express");
const {
    pushData,
    createForms,
} = require("../routeHandlers/formsRouteHandler");

const router = express.Router();

// tell backend to push form data to database
router.post("/:unitCode/:year/:period/", pushData);
router.post("/:unitCode/:year/:period/create", createForms);

module.exports = router;
