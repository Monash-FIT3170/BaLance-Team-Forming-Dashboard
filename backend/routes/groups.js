const express = require('express')
const router = express.Router()
const { // import controller functions for route handlers
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup
} = require('../controllers/groupController')

// get all groups for a specific unit
router.get('/', (req, res) => {console.log("GET all teams");})

// get a specific group for a specific unit
router.get('/:groupId', getGroup)

// add a new group to a unit
router.post('/', addGroup)

// delete a specific group from a unit
router.delete('/:groupId', deleteGroup)

// update a specific group from a unit
router.patch('/:groupId', updateGroup)

// export this router for external use
module.exports = router