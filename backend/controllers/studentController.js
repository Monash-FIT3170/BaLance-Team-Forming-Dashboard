/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */
const db_connection = require("../config/databaseConfig");

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

// gets all students for a unit
const getAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params

    const studentsData = await promiseBasedQuery(
        "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, group_number, lab_number "+
        "FROM student stud "+
        "inner join unit_enrolment ue on ue.stud_unique_id=stud.stud_unique_id " +
        "inner join unit_offering unit on ue.unit_off_id=unit.unit_off_id " +
        "left join (select stud.student_id as student_id, group_number, lab_number "+
					"from student stud "+
					"inner join group_allocation ga on stud.stud_unique_id = ga.stud_unique_id "+
					"inner join lab_group lg on ga.lab_group_id = lg.lab_group_id "+
					"inner join unit_off_lab uol on uol.unit_off_lab_id = lg.unit_off_lab_id "+
					"inner join unit_offering uo on uo.unit_off_id = uol.unit_off_id "+
					"WHERE uo.unit_code=? AND uo.unit_off_year=? AND uo.unit_off_period=?) " +
		"grp on stud.student_id = grp.student_id "+
        "WHERE unit.unit_code=? "+
        "AND unit.unit_off_year=? "+
        "AND unit.unit_off_period=? "+
        "ORDER BY group_number;",
        [unitCode, year, period, unitCode, year, period]
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

    console.log(requestBody)

    /* INSERT STUDENTS INTO DATABASE */
    // get the attributes we need and their values in prep for SQL queries
    //   e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
    const studentInsertData = requestBody.map(
        ({ labCode, ...rest }) => {return Object.values(rest);}
    );
    await insertStudents(studentInsertData)

    /* CREATE UNIT ENROLMENT BETWEEN STUDENTS AND UNIT */
    const studentEmails = requestBody.map((student) => student.email);
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

    try {
        const connection = await db_connection.promise().getConnection();

        try{

            await connection.beginTransaction()

            await connection.execute( // delete effort personality test results for student
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

            await connection.execute( // delete belbin personality test results for student
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

            await connection.execute( // delete personality test attempt for student
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

            await connection.execute( // delete group allocation for student
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

            await connection.execute( // delete lab allocation for student
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

            await connection.execute( // delete unit enrolment for student
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

            await connection.commit();
            await connection.release();
        }

        catch(error) {
            console.log(error);
            await connection.rollback();
            await connection.release();
        }
    }
    catch(error) {
        console.log(error);
    }

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

// add a cohorts personality data to a specific unit
const addPersonalityData = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params
    const {
        students,
        testType
    } = req.body;

    /* MAKE SURE ALL STUDENT'S ARE ADDRESSED IN THE DATA BEING UPLOADED */
    // get count of enrolled students
    // compare to length of body
    const [{ numEnrolledStudents }] = await promiseBasedQuery(
        "SELECT count(*) AS `numEnrolledStudents` FROM student s " +
        "   INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id " +
        "   INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id " +
        "WHERE" +
        "   u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
        [unitCode, year, period]
    )

    if(numEnrolledStudents !== students.length) {
        res.status(400).json({
            'error': 'personality data does not address all enrolled students'
        })
        return;
    }

    /* GET VALUES NEEDED FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
    const unitOffKey = await selectUnitOffKey(unitCode, year, period);
    const studentIds = students.map(student => student.studentId)

    const studentIdKeyData = await promiseBasedQuery(
        "SELECT s.stud_unique_id, s.student_id FROM unit_enrolment e " +
        " INNER JOIN unit_offering u ON u.unit_off_id = e.unit_off_id " +
        " INNER JOIN student s ON s.stud_unique_id = e.stud_unique_id " +
        "WHERE " +
        " u.unit_code=? " +
        " AND u.unit_off_year=? " +
        " AND u.unit_off_period=? " +
        " AND s.student_id IN (?);",
        [unitCode, year, period, studentIds]
    )

    /* CONVERT VALUES INTO AN APPROPRIATE FORMAT FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
    // [[testType, unitOffKey, studentPrimaryKey], ...] for insert to personality_test_attempt
    const testAttemptInsertData = [];
    studentIdKeyData.forEach((student) => {
        testAttemptInsertData.push([testType, unitOffKey, student.stud_unique_id])
    })

    /* INSERT PERSONALITY TEST ATTEMPT */
    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO personality_test_attempt (test_type, unit_off_id, stud_unique_id) " +
            "VALUES ?;",
            [testAttemptInsertData]
        );
    } catch (err) {
        console.log(err);
    }

    /* GET VALUES NEEDED FOR INSERT QUERY FOR BELBIN_RESULT */
    // this gets ALL personality test attempts but not just the ones of this type fixme
    const personalityTestAttemptKeys = await promiseBasedQuery(
        "SELECT t.test_attempt_id, s.student_id " +
        "FROM personality_test_attempt t " +
        "   INNER JOIN student s ON s.stud_unique_id=t.stud_unique_id " +
        "   INNER JOIN unit_enrolment e ON e.stud_unique_id=t.stud_unique_id " +
        "WHERE " +
        "   e.unit_off_id=? " +
        "   AND t.test_type=? " +
        "   AND s.student_id IN (?);",
        [unitOffKey, testType, studentIds]
    )

    addTestResultFunctionStrats[testType](personalityTestAttemptKeys, students)
    res.status(200).send();
}

const addStudentBelbin = async (personalityTestAttemptKeys, students) => {
    // [[personality_test_attempt, belbin_type], ...] for insert to belbin_result
    const resultInsertData = []
    personalityTestAttemptKeys.forEach((attempt) => {
        // find the student who made this attempt
        const [student] = students.filter((student) => {return student.studentId === attempt.student_id})
        resultInsertData.push([attempt.test_attempt_id, student.belbinType])
    })

    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO belbin_result (personality_test_attempt, belbin_type) " +
            "VALUES ?;",
            [resultInsertData]
        )
    } catch (err) {
        console.log(err);
    }
}

const addStudentEffort = async (personalityTestAttemptKeys, students) => {
    // [[personality_test_attempt, belbin_type], ...] for insert to belbin_result
    const resultInsertData = []
    personalityTestAttemptKeys.forEach((attempt) => {
        // find the student who made this attempt
        const [student] = students.filter((student) => {return student.studentId === attempt.student_id})
        resultInsertData.push([
            attempt.test_attempt_id,
            student.avgAssignmentMark,
            student.hourCommitment,
            student.avgAssignmentMark/student.hourCommitment
        ])
    })

    console.log(resultInsertData);

    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO effort_result " +
            "(personality_test_attempt, assignment_avg, time_commitment_hrs, marks_per_hour) " +
            "VALUES ?;",
            [resultInsertData]
        )
    } catch (err) {
        console.log(err);
    }
}

const addTestResultFunctionStrats = {
    'belbin': addStudentBelbin,
    'effort': addStudentEffort
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    updateStudent,
    addPersonalityData
};