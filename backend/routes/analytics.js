const { // import controller functions for route handlers
    getAllGroupsAnalytics,
    getGroupAnalytics
} = require('../controllers/analyticsController');

const express = require('express');
const router = express.Router();

// get all group analytics
router.get('/:unitCode/:year/:period/', async (req, res) => {console.log('testing')}) //getAllGroupsAnalytics)

// get a specific group analytics
router.get('/:unitCode/:year/:period/:groupNumber', getGroupAnalytics)

// export this router for external use
module.exports = router;