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
    addStudent,
    deleteStudent,
    updateStudent
} = require('../controllers/studentController');

// get all students from a unit
router.get('/:unitId', getAllStudents);

// get a specific student from a unit
router.get('/:unitId/:studId', getStudent);

// add an array of students to a unit
router.post('/:unitId', addAllStudents);

// add a new student to a unit
router.post('/:unitId/new', addStudent);

// delete a specific student from a unit
router.delete('/:unitId/:studId', deleteStudent);

// update a student for a unit
router.patch('/:unitId/:studId', updateStudent);

// export this router for external use
module.exports = router;