const express = require("express");
const {
    pushData,
    createForms,
    getForms,
    closeOpenForm
} = require("../routeHandlers/formsRouteHandler");

const router = express.Router();

// tell backend to push form data to database
router.post("/:unitCode/:year/:period/", pushData);

// create google forms
router.post("/:unitCode/:year/:period/create", createForms);

// get all open forms
router.get("/:unitCode/:year/:period/", getForms);

// close google forms
router.post("/:unitCode/:year/:period/close", closeOpenForm);

module.exports = router;
