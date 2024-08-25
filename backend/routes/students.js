const express = require("express");
const router = express.Router();
const {
    getAllStudents,
    addAllStudents,
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    addPersonalityData,
    addStudentTimesAndPreferences,
} = require("../routeHandlers/studentRouteHandler");

// get all students from a unit
router.get("/:unitCode/:year/:period", getAllStudents);

// add an array of students to a unit
router.post("/:unitCode/:year/:period", addAllStudents);

// add personality data to students
router.post("/personality/:unitCode/:year/:period", addPersonalityData);

// add times and preferences data
router.post("/times/:unitCode/:year/:period", addStudentTimesAndPreferences);

// delete a specific student from a unit
router.delete("/enrolment/:unitCode/:year/:period/:studentId", deleteStudentEnrolment);

// delete a specific student from a group
router.delete("/groupAlloc/:unitCode/:year/:period/:studentId/", deleteStudentGroupAlloc);

// export this router for external use
module.exports = router;
