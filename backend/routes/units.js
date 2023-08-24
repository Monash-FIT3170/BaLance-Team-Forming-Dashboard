/**
 * A module containing route handlers for unit related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    updateUnit,
    uploadCustomScript
} = require('../controllers/unitController');

const { upload } = require('../helpers/uploadMiddleware');

// get all units for a user
router.get('/', getAllUnits);

// get a specific unit for a user
router.get('/:unitCode/:year/:period', getUnit);

router.post('/:unitCode/:year/:period/uploadScript', upload.single('pythonFile'), uploadCustomScript);

// add a new unit for the user
router.post('/', addUnit);

// delete a specific unit for a user
router.delete('/:unitCode/:year/:period', deleteUnit);

// update a specific unit for a user
router.patch('/:unitCode/:year/:period', updateUnit);

// export this router for external use
module.exports = router;