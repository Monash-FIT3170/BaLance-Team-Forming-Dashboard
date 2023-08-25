const { // import controller functions for route handlers
    getAllGroupsAnalytics,
    getGroupAnalytics
} = require('../controllers/analyticsController');

// get all group analytics
router.get('/analytics/:unitCode/:year/:period/', async (req, res) => {console.log('testing')}) //getAllGroupsAnalytics)

// get a specific group analytics
router.get('/analytics/:unitCode/:year/:period/:groupNumber', getGroupAnalytics)