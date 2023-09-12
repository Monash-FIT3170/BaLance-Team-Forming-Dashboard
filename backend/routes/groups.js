/**
 * A module containing route handlers for group related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllGroups,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
} = require('../controllers/groupController');

const {
    uploadCustomScript,
} = require('../controllers/scriptController');

const multer = require('multer');

const storage = multer.diskStorage({ // fixme is this not in middleware/uploadMiddleware.js?
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

// create unit groups
router.post('/:unitCode/:year/:period', createUnitGroups);

// shuffle unit groups
router.post('/shuffle/:unitCode/:year/:period', shuffleUnitGroups);

// ...
router.post('/:unitCode/:year/:period/uploadScript', upload.single('pythonFile'), uploadCustomScript, )

// move a student between two groups
router.patch('/:unitCode/:year/:period/move/:studentId/', moveStudent);

// export this router for external use
module.exports = router;