/**
 * A module containing route handlers for group related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups,
    moveStudent
} = require('../controllers/groupController');

// Api Structure /api/groups/{unitId}/{groupId}

// get all groups for a specific unit
router.get('/:unitCode/:year/:period', getAllGroups);

// get a specific group for a specific unit
router.get('/:unitCode/:year/:period/:groupNumber', getGroup);

// create unit groups
router.post('/:unitCode/:year/:period', createUnitGroups);

// add a new group to a unit
router.post('/:unitCode/:year/:period/new', addGroup);

// delete a specific group from a unit
router.delete('/:unitCode/:year/:period/:groupNumber', deleteGroup);

// update a specific group from a unit
router.patch('/:unitCode/:year/:period/:groupNumber', updateGroup);

// move a student between two groups
router.patch('/:unitCode/:year/:period/move/:studentId/', moveStudent)

// export this router for external use
module.exports = router;