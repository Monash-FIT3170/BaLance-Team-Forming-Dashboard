const express = require('express')
const router = express.Router()

// TODO API endpoints for units
router.get('/', (req, res) => {
    console.log("GET all teams");
})

// export this router for external use
module.exports = router