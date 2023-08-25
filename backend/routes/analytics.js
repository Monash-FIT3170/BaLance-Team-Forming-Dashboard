/**
 * A module containing route handlers for analytics related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllGroupsAnalytics,
    getGroupAnalytics
} = require('../controllers/analyticsController');

//get a unit analytics
router.get('/:unitCode/:year/:period', getAllGroupsAnalytics)

//get a specific group analytics
router.get('/:unitCode/:year/:period/:groupNumber', getGroupAnalytics)

module.exports=router;