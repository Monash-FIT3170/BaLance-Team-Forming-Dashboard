/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const {promiseBasedQuery} = require("../helpers/commonHelpers");
const {
    insertStudents,
    selectStudentsKeys,
    selectUnitOffKey,
    insertStudentEnrolment,
    insertUnitOffLabs,
    insertStudentLabAllocations
} = require("../helpers/studentControllerHelpers");

/* CONTROLLER FUNCTIONS */
// gets all students for a unit
const getAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params

    // todo assess improvements from student enrolment containing code, year, period
    const studentsData = await promiseBasedQuery(
        "SELECT student_id, preferred_name, last_name, email_address FROM student " +
        "INNER JOIN unit_enrolment ON student.stud_unique_id=unit_enrolment.stud_unique_id " +
        "INNER JOIN unit_offering ON unit_offering.unit_off_id=unit_enrolment.unit_off_id " +
        "WHERE " +
        "unit_offering.unit_code=? " +
        "AND unit_offering.unit_off_year=? " +
        "AND unit_offering.unit_off_period=?; ",
        [unitCode, year, period]
    )

    res.status(200).json(studentsData);
}

// get a single student for a unit
const getStudent = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// enroll an array of students to a unit
const addAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params
    const requestBody = req.body

    /* INSERT STUDENTS INTO DATABASE */
    // get the attributes we need and their values in prep for SQL queries
    //   e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
    const studentInsertData = requestBody.map(
        ({ labId, enrolmentStatus, discPersonality, ...rest }) => {return Object.values(rest);}
    );
    await insertStudents(studentInsertData)

    /* CREATE UNIT ENROLMENT BETWEEN STUDENTS AND UNIT */
    const studentEmails = requestBody.map((student) => student.studentEmailAddress);
    const studentKeys = await selectStudentsKeys(studentEmails);
    const unit_off_id = await selectUnitOffKey(unitCode, year, period);
    await insertStudentEnrolment(studentKeys, unit_off_id);

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
    await insertUnitOffLabs(requestBody, unit_off_id); // ensure only 1 lab number of value n, per unit offering
    await insertStudentLabAllocations(requestBody, unit_off_id);

    res.status(200).send();
}

// add a single student to a unit
const addStudent = async (req, res) => {
    /* todo ADD STUDENT IF NOT EXISTS */
    /* todo ADD STUDENT TO UNIT */
    /* todo ADD STUDENT TO LAB */
    /* todo UPDATE UNIT ENROLMENT COUNT */
    res.status(200).send({wip: "test"});
}

// delete a single student from a unit
const deleteStudent = (req, res) => {
    /* todo DON'T DELETE STUDENT FROM student TABLE AS THEY MIGHT BE IN OTHER UNITS */
    /* todo REMOVE STUDENT FROM THIS UNIT */
    /* todo REMOVE STUDENT FROM GROUPS AND LABS */
    res.status(200).send({wip: "test"});
}

// update a student's details
const updateStudent = async (req, res) => {
    res.status(200).send({wip: "test"});
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    addStudent,
    deleteStudent,
    updateStudent
};