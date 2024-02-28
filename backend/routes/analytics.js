const express = require("express");
const {
    getUnitAnalytics,
    getGroupAnalytics
} = require("../routeHandlers/analyticsRouteHandler");

const router = express.Router();

// get all group analytics
router.get("/:unitCode/:year/:period/", getUnitAnalytics);

// get a specific group analytics
router.get("/:unitCode/:year/:period/:groupNumber", getGroupAnalytics);

// export this router for external use
module.exports = router;
