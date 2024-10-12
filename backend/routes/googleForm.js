const express = require("express");
const {
    generateForms
} = require("../routeHandlers/formsRouteHandler");

const router = express.Router();

// tell backend to push form data to database
router.post("/:unitCode/:year/:period/", generateForms);

module.exports = router;
