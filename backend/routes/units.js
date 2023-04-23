const express = require('express')
const router = express.Router()

const unitController = require('../controllers/unitController');

// '/api/units/'

// TODO API endpoints for units
// GET api/units/ --> returns the users units but not group stuff
// GET api/units/:id --> get all info for a specific unit -> labs, faculty, teacher
// POST api/units/ --> adds a new unit
// DELETE api/units/:id --> deletes the specified unit
// PUT api/units/:id --> updates a specific units information

router.get('/', (req, res) => {
    console.log("GET all units");
})


router.post('/', (req, res) => {
    console.log("GET all units");
})

router.delete('/:unitId', unitController.deleteUnit);

router.patch('/:unitId', unitController.updateUnit);

// export this router for external use
module.exports = router