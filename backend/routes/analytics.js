/**
 * A module containing route handlers for analytics related
 * API calls
 *
 */

const express = require("express");
const {
  // import controller functions for route handlers
  getUnitAnalytics,
  getGroupAnalytics,
} = require("../routeHandlers/analyticsRouteHandler");

const router = express.Router();

// get all group analytics
router.get("/:unitCode/:year/:period/", getUnitAnalytics);

// get a specific group analytics
router.get("/:unitCode/:year/:period/:groupNumber", getGroupAnalytics);

// export this router for external use
module.exports = router;
