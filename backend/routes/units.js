const express = require('express')
const router = express.Router()

// TODO API endpoints for units
router.get('/', (req, res) => {
    console.log("GET all units");
})

// export this router for external use
module.exports = router