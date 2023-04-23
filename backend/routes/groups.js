const express = require('express')
const router = express.Router()

const groupController = require('../controllers/groupController');

// TODO API endpoints for units
// GET api/units/:id/groups --> all groups in the unit



router.get('/', (req, res) => {
    console.log("GET all teams");
})

router.get('/:unitId/groups', groupController.getAllGroups)

// export this router for external use
module.exports = router