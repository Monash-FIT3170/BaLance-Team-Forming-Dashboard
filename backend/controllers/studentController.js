/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

const {
    insertStudents,
    selectStudentsKeys,
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

    const studentsData = await promiseBasedQuery(
        "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, " +
        "   l_group.group_number, lab.lab_number " +
        "FROM student stud " +
        "INNER JOIN group_allocation g_alloc ON stud.stud_unique_id=g_alloc.stud_unique_id " +
        "INNER JOIN lab_group l_group ON g_alloc.lab_group_id=l_group.lab_group_id " +
        "INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_group.unit_off_lab_id " +
        "INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id " +
        "WHERE " +
        "   unit.unit_code=? " +
        "   AND unit.unit_off_year=? " +
        "   AND unit.unit_off_period=? " +
        "ORDER BY l_group.group_number;",
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
    const unitOffId = await selectUnitOffKey(unitCode, year, period);
    await insertStudentEnrolment(studentKeys, unitOffId);

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
    await insertUnitOffLabs(requestBody, unitOffId); // ensure only 1 lab number of value n, per unit offering
    await insertStudentLabAllocations(requestBody, unitOffId);

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
    /* todo DELETE STUDENTS ENROLMENT FOR THIS UNIT */
    /* todo DELETE STUDENT ALLOCATION TO THEIR GROUPS AND LABS IN THIS UNIT */

    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;

    // to either delete from the whole unit or only the group
    const { deleteStudentFromGroup } = req.query;

    // error handling for unexpected issues
    try {
        if (deleteStudentFromGroup) {
            await promiseBasedQuery(
                "DELETE FROM student_lab_allocation " +
                "WHERE student_id=? AND unit_off_id=(SELECT unit_off_id FROM unit_offering WHERE unit_code=? " +
                "AND unit_off_year=? AND unit_off_period=?);",
                [studentId, unitCode, year, period]
            );
            // Respond with success message
            res.status(200).send({ message: "Student successfully deleted from lab allocations"});
        } else {
             // Delete the student from entire unit
             await promiseBasedQuery(
                  "DELETE FROM unit_enrolment " +
                  "WHERE student_id=? AND unit_off_id=(SELECT unit_off_id FROM unit_offering WHERE unit_code=? " +
                  "AND unit_off_year=? AND unit_off_period=?);",
                  [studentId, unitCode, year, period]
             );
             // Respond with success message
             res.status(200).send({ message: "Student successfully deleted from specified unit"});
        }
    } catch (err) {
        // Respond with error message
        console.error("An error occurred while deleting", err);
        res.status(500).send({ message: "An error occurred while deleting"});
    }
}

// update a student's details
const updateStudent = async (req, res) => {
    const { studentId } = req.params // get the URL params
    const updateStudentDetails = req.body

    try {
        const updateQuery =
            "UPDATE student " +
            "SET preferred_name=?, last_name=?, email_address=?, wam_val=? " +
            "WHERE student_id=? ";
        // updated values for the student
        const { preferred_name, last_name, email_address, wam_val } = updateStudentDetails;

        await promiseBasedQuery(updateQuery, [preferred_name, last_name, email_address, wam_val, studentId]);
        // Respond with success message
        res.status(200).send({ message: "Student details updated"});

    } catch (err) {
        // Respond with error message
        console.log("Error while updating student ", err);
        res.status(500).send({ error: "Error occurred while updating student details" })
    }
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    addStudent,
    deleteStudent,
    updateStudent
};