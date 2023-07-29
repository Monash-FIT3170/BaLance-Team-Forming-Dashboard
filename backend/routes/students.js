/**
 * A module containing route handlers for student related
 * API calls
 *
 */

const express = require('express');
const router = express.Router();
const { // import controller functions for route handlers
    getAllStudents,
    getStudent,
    addAllStudents,
    deleteStudent,
    updateStudent
} = require('../controllers/studentController');

// get all students from a unit
router.get('/:unitCode/:year/:period', getAllStudents);

// get a specific student from a unit
router.get('/:unitCode/:year/:period/:studId', getStudent);

// add an array of students to a unit
router.post('/:unitCode/:year/:period', addAllStudents);

// delete a specific student from a unit
router.delete('/:unitCode/:year/:period/:studId', deleteStudent);

// todo @nethara add a delete route that takes in the new delete function here

// update a student for a unit
router.patch('/:unitCode/:year/:period/:studId', updateStudent);

// export this router for external use
module.exports = router;