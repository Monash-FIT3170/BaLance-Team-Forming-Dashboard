/**
 * A module containing route handlers for group related
 * API calls
 *
 */

const express = require('express')
const router = express.Router()
const { // import controller functions for route handlers
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups
} = require('../controllers/groupController')

// Api Structure /api/groups/{unitId}/{groupId}

// get all groups for a specific unit
router.get('/:unitId/', getAllGroups)

// get a specific group for a specific unit
router.get('/:unitId/:groupId', getGroup)

// create unit groups
router.post('/:unitId/', createUnitGroups)

// add a new group to a unit
router.post('/', addGroup)

// delete a specific group from a unit
router.delete('/:unitId/:groupId', deleteGroup)

// update a specific group from a unit
router.patch('/:unitId/:groupId', updateGroup)

// export this router for external use
module.exports = router