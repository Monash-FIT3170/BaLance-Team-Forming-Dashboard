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
    await insertStudentEnrolment(studentKeys, unitOffId, unitCode, year, period);

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
    await insertUnitOffLabs(requestBody, unitOffId, unitCode, year, period); // ensure lab no.s don't repeat in units
    await insertStudentLabAllocations(requestBody, unitOffId, unitCode, year, period);

    res.status(200).send();
}

// delete a single student from the unit
const deleteStudentEnrolment = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;

    // error handling for unexpected issues
    try {
        // Delete the student unit enrolment
        const enrolment_id = await promiseBasedQuery(
            "SELECT enrolment_id FROM unit_offering u " +
             "INNER JOIN unit_enrolment ue ON ue.unit_off_id=u.unit_off_id " +
             "INNER JOIN student s ON s.stud_unique_id=ue.stud_unique_id " +
             "WHERE " +
                "u.unit_code=? " +
                "AND u.unit_off_year=? " +
                "AND u.unit_off_period=? " +
                "AND s.student_id=?;",
                [unitCode, year, period, studentId]
        );

        await promiseBasedQuery(
            "DELETE FROM unit_enrolment " +
             "WHERE enrolment_id=?; ",
             [enrolment_id]
        );

        if (!enrolment_id) {
            return res.status(404).send({ message: "Student enrolment not found" });
        }

        // todo delete lab allocation for this student
        const stud_lab_alloc_id = await promiseBasedQuery(
            "SELECT stud_lab_alloc_id FROM student s " +
            "INNER JOIN student_lab_allocation sa ON s.stud_unique_id=sa.stud_unique_id " +
            "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=sa.unit_off_lab_id " +
            "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id" +
            "WHERE" +
                "u.unit_code=? " +
                "AND u.unit_off_year=? " +
                "AND u.unit_off_period=? " +
                "AND s.student_id=?; ",
                [unitCode, year, period, studentId]
        );

        await promiseBasedQuery(
            "DELETE FROM student_lab_allocation " +
            "WHERE stud_lab_alloc_id=?; ",
            [stud_lab_alloc_id]
        );

        if (!stud_lab_alloc_id) {
            return res.status(404).send({ message: "Student lab allocation not found" });
        }

        // todo delete group allocation for this student
        const group_alloc_id = await promiseBasedQuery(
            "SELECT group_alloc_id " +
            "FROM student s " +
            "INNER JOIN group_allocation ga ON ga.stud_unique_id=s.stud_unique_id " +
            "INNER JOIN lab_group lg ON lg.lab_group_id=ga.lab_group_id " +
            "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=lg.unit_off_lab_id " +
            "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
            "WHERE " +
            "u.unit_code=? " +
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period=? " +
            "AND s.student_id=?;",
            [unitCode, year, period, studentId]
        );

        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE group_alloc_id=?;",
            [group_alloc_id]
        )

        if (!enrolment_id) {
            return res.status(404).send({ message: "Student group allocation not found" });
        }

        // Respond with success message
        res.status(200).send({ message: "Student successfully deleted from specified unit"});

    } catch (err) {
        // Respond with error message
        console.error("An error occurred while deleting", err);
        res.status(500).send({ message: "An error occurred while deleting"});
    }
}

// delete a single student from group
const deleteStudentGroupAlloc = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;
    // error handling for unexpected issues
    try {
         // Delete student from group
        const group_alloc_id = await promiseBasedQuery(
            "SELECT group_alloc_id " +
            "FROM student s " +
            "INNER JOIN group_allocation ga ON ga.stud_unique_id=s.stud_unique_id " +
            "INNER JOIN lab_group lg ON lg.lab_group_id=ga.lab_group_id " +
            "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=lg.unit_off_lab_id " +
            "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
            "WHERE " +
            "u.unit_code=? " +
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period=? " +
            "AND s.student_id=?;",
            [unitCode, year, period, studentId]
        );

        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE group_alloc_id=?;",
            [group_alloc_id]
        )
         // Respond with success message todo later, look into best practices for res messages in DEL requests
         res.status(200).send({ message: "Student successfully deleted from lab allocations"});
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

    // error handling for unexpected issues
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
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    updateStudent
};