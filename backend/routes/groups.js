/**
 * A module containing route handlers for group related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent,
    getAllGroupsAnalytics,
    getGroupAnalytics
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

// Api Structure /api/groups/{unitId}/{groupId}

// get all groups for a specific unit
router.get('/:unitCode/:year/:period', getAllGroups);

// get a specific group for a specific unit
router.get('/:unitCode/:year/:period/:groupNumber', getGroup);

// create unit groups
router.post('/:unitCode/:year/:period', createUnitGroups);

// shuffle unit groups
router.post('/shuffle/:unitCode/:year/:period', shuffleUnitGroups);

// add a new group to a unit
router.post('/:unitCode/:year/:period/new', addGroup);

router.post('/:unitCode/:year/:period/uploadScript', upload.single('pythonFile'), uploadCustomScript, )

// delete a specific group from a unit
router.delete('/:unitCode/:year/:period/:groupNumber', deleteGroup);

// move a student between two groups
router.patch('/:unitCode/:year/:period/move/:studentId/', moveStudent);

// export this router for external use
module.exports = router;