/**
 * A module containing route handlers for unit related
 * API calls
 *
 */

const express = require('express')
const router = express.Router()
const { // import controller functions for route handlers
    deleteUnit,
    updateUnit
} = require('../controllers/unitController');

// get all units for a user FIXME
router.get('/', (req, res) => {
    console.log("GET all units");
})

// get a specific unit for a user TODO

// add a new unit for the user FIXME
router.post('/', (req, res) => {
    console.log("GET all units");
})

// delete a specific unit for a user
router.delete('/:unitId', deleteUnit);

// update a specific unit for a user
router.patch('/:unitId', updateUnit);

// export this router for external use
module.exports = router