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
        "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val " +
        "FROM student stud " +
        "inner join unit_enrolment ue on ue.stud_unique_id=stud.stud_unique_id " +
        "inner join unit_offering unit on ue.unit_off_id=unit.unit_off_id " +
        "WHERE unit.unit_code=? " +
        "AND unit.unit_off_year=? " +
        "AND unit.unit_off_period=?",
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
    await insertUnitOffLabs(requestBody, unitOffId); // ensure lab no.s don't repeat in units
    await insertStudentLabAllocations(requestBody, unitOffId);

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

    await promiseBasedQuery( // delete effort personality test results for student
        "DELETE FROM effort_result " +
        "WHERE effort_result_id IN ( " +
        "   SELECT subquery.effort_result_id " +
        "   FROM ( " +
        "       SELECT e.effort_result_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN personality_test_attempt pt ON pt.unit_off_id = u.unit_off_id " +
        "           INNER JOIN effort_result e ON e.personality_test_attempt = pt.test_attempt_id " +
        "           INNER JOIN student s ON s.stud_unique_id = pt.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    await promiseBasedQuery( // delete belbin personality test results for student
        "DELETE FROM belbin_result " +
        "WHERE belbin_result_id IN ( " +
        "   SELECT subquery.belbin_result_id " +
        "   FROM ( " +
        "       SELECT b.belbin_result_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN personality_test_attempt pt ON pt.unit_off_id = u.unit_off_id " +
        "           INNER JOIN belbin_result b ON b.personality_test_attempt = pt.test_attempt_id " +
        "           INNER JOIN student s ON s.stud_unique_id = pt.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        "); ",
        [unitCode, year, period, studentId]
    )

    await promiseBasedQuery( // delete personality test attempt for student
        "DELETE FROM personality_test_attempt " +
        "WHERE test_attempt_id IN ( " +
        "   SELECT subquery.test_attempt_id " +
        "   FROM ( " +
        "       SELECT pt.test_attempt_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN personality_test_attempt pt ON pt.unit_off_id = u.unit_off_id " +
        "           INNER JOIN student s ON s.stud_unique_id = pt.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    await promiseBasedQuery( // delete group allocation for student
        "DELETE FROM group_allocation " +
        "WHERE group_alloc_id IN ( " +
        "   SELECT subquery.group_alloc_id " +
        "   FROM ( " +
        "       SELECT ga.group_alloc_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN unit_off_lab l ON u.unit_off_id = l.unit_off_id " +
        "           INNER JOIN lab_group g ON g.unit_off_lab_id = l.unit_off_lab_id " +
        "           INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id " +
        "           INNER JOIN student s ON s.stud_unique_id = ga.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    await promiseBasedQuery( // delete lab allocation for student
        "DELETE FROM student_lab_allocation " +
        "WHERE stud_lab_alloc_id IN ( " +
        "   SELECT subquery.stud_lab_alloc_id " +
        "   FROM ( " +
        "       SELECT la.stud_lab_alloc_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN unit_off_lab l ON u.unit_off_id = l.unit_off_id " +
        "           INNER JOIN student_lab_allocation la ON la.unit_off_lab_id = l.unit_off_lab_id " +
        "           INNER JOIN student s ON s.stud_unique_id = la.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    await promiseBasedQuery( // delete unit enrolment for student
        "DELETE FROM unit_enrolment " +
        "WHERE enrolment_id IN ( " +
        "   SELECT subquery.enrolment_id " +
        "   FROM ( " +
        "       SELECT ue.enrolment_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN unit_enrolment ue ON u.unit_off_id = ue.unit_off_id " +
        "           INNER JOIN student s ON s.stud_unique_id = ue.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    res.status(200).send();
}

// delete a single student from group
const deleteStudentGroupAlloc = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;

    await promiseBasedQuery(
        "DELETE FROM group_allocation " +
        "WHERE group_alloc_id IN ( " +
        "   SELECT subquery.group_alloc_id " +
        "   FROM ( " +
        "       SELECT ga.group_alloc_id " +
        "       FROM unit_offering u " +
        "           INNER JOIN unit_off_lab l ON u.unit_off_id = l.unit_off_id " +
        "           INNER JOIN lab_group g ON g.unit_off_lab_id = l.unit_off_lab_id " +
        "           INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id " +
        "           INNER JOIN student s ON s.stud_unique_id = ga.stud_unique_id " +
        "       WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND s.student_id=? " +
        "   ) AS subquery " +
        ");",
        [unitCode, year, period, studentId]
    )

    res.status(200).send();
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

const addPersonalityData = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params
    const {
        students,
        dataType
    } = req.body;

    // call the right function in object todo
}
const addStudentBelbin = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params
    const students = req.body;

    console.log(students)

    /* INSERT PERSONALITY TEST ATTEMPT */
    for(let i = 0; i < students.length; i++){
        let student = students[i];
        try {
            await promiseBasedQuery(
                "insert into personality_test_attempt (test_type, stud_unique_id, unit_off_id) " +
                "values ('belbin', (select stud_unique_id from student where student_id like ?), " +
                "(select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? " +
                "and lower(unit_off_period) like ?) ) ",
                [students[i].studentId, unitCode, year, period]
            );
        } catch (err) {
            console.log("Error while updating student ", err);
        }
    }

    /* INSERT THE ACTUAL BELBIN RESULT */
    for(let i = 0; i < students.length; i++){
        let student = students[i];
        try {
            await promiseBasedQuery(
                "insert into belbin_result (personality_test_attempt, belbin_type) " +
                "values ((select test_attempt_id from personality_test_attempt where test_type like 'belbin' and stud_unique_id like (select stud_unique_id from student where student_id like ? and test_type = 'belbin') and unit_off_id like (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?)), ?)",
                [student.studentId, unitCode, year, period, student.belbinType]);
        } catch (err) {
            console.log("Error while updating student ", err);
        }
    }
}

const addStudentEffort = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params
    const students = req.body;

    console.log(students)
    /* INSERT PERSONALITY TEST ATTEMPT */
    for(let i = 0; i < students.length; i++){
        let student = students[i];
        try {
            await promiseBasedQuery(
                "insert into personality_test_attempt (test_type, stud_unique_id, unit_off_id) " +
                "values ('effort', (select stud_unique_id from student where student_id like ?), (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?) ) ",
                [student.studentId, unitCode, year, period]
            );
        } catch (err) {
            console.log("Error while updating student ", err);
        }
    }

    /* INSERT THE ACTUAL BELBIN RESULT */
    for(let i = 0; i < students.length; i++){
        let student = students[i];
        try {
            await promiseBasedQuery(
                "insert into effort_result (personality_test_attempt, time_commitment_hrs, assignment_avg, marks_per_hour) " +
                "values ((select test_attempt_id from personality_test_attempt where test_type like 'effort' and stud_unique_id like (select stud_unique_id from student where student_id like ? ) and unit_off_id like (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?)), ?, ?, ?)",
                [student.studentId, unitCode, year, period, student.hours, student.averageMark, student.marksPerHour]
            );
        } catch (err) {
            console.log("Error while updating student ", err);
        }
    }
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    updateStudent,
    addStudentBelbin,
    addStudentEffort 
};