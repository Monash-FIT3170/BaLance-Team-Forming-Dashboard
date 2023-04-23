const express = require('express')
const router = express.Router()

const unitController = require('../controllers/unitController');

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