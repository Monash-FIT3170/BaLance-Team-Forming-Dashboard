/**
 * A module containing route handlers for group related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllGroups,
    getLabNumber,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
} = require('../controllers/groupController');

const {
    uploadCustomScript,
} = require('../controllers/scriptController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './tmp/my-uploads')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}`)
    }
})

const upload = multer({ storage });

// get all groups for a specific unit
router.get('/:unitCode/:year/:period', getAllGroups);

// get the lab number for a specific offering's group
router.get('/:unitCode/:year/:period/labNumber/:groupNumber', getLabNumber)

// create unit groups
router.post('/:unitCode/:year/:period', createUnitGroups);

// shuffle unit groups
router.post('/shuffle/:unitCode/:year/:period', shuffleUnitGroups);

router.post('/:unitCode/:year/:period/uploadScript', uploadCustomScript );

// move a student between two groups
router.patch('/:unitCode/:year/:period/move/:studentId/:hasAGroup', moveStudent);

// export this router for external use
module.exports = router;