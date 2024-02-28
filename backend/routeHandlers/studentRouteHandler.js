/**
 * This module should only contain functions that handle routes related
 * to students and student data
 *
 * */

const { promiseBasedQuery, selectUnitOffKey } = require("../helpers/commonHelpers");

const {
  insertStudents,
  selectStudentsKeys,
  insertStudentEnrolment,
  insertUnitOffLabs,
  insertStudentLabAllocations,
} = require("../helpers/studentRouteHandlerHelpers");

const getAllStudents = async (req, res) => {
    /**
     * Basic select of students in a unit from the database. Requires student group and lab num to be included
     * as well as if group is null.
     */
    const {
        unitCode,
        year,
        period,
    } = req.params;

    const studentsData = await promiseBasedQuery(
        "SELECT all_studs.student_id, all_studs.preferred_name, all_studs.last_name, all_studs.email_address, all_studs.wam_val, group_allocated_studs.group_number, all_studs.lab_number " +
        "FROM ( " +
        "   SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, l_group.group_number, lab.lab_number " +
        "   FROM student stud " +
        "       INNER JOIN group_allocation g_alloc ON stud.stud_unique_id=g_alloc.stud_unique_id " +
        "       INNER JOIN lab_group l_group ON g_alloc.lab_group_id=l_group.lab_group_id " +
        "       INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_group.unit_off_lab_id " +
        "       INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id " +
        "   WHERE " +
        "       unit.unit_code=? " +
        "       AND unit.unit_off_year=? " +
        "       AND unit.unit_off_period=? " +
        ") AS group_allocated_studs " +
        "RIGHT JOIN ( " +
        "   SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, lab.lab_number " +
        "   FROM student stud " +
        "       INNER JOIN student_lab_allocation l_alloc ON l_alloc.stud_unique_id=stud.stud_unique_id " +
        "       INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_alloc.unit_off_lab_id " +
        "       INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id " +
        "   WHERE " +
        "       unit.unit_code=? " +
        "       AND unit.unit_off_year=? " +
        "       AND unit.unit_off_period=? " +
        ") AS all_studs ON group_allocated_studs.email_address=all_studs.email_address " +
        "ORDER BY group_number;",
        [unitCode, year, period, unitCode, year, period]
    );

    res.status(200).json(studentsData);
};

const addAllStudents = async (req, res) => {
    /**
     * Takes a list of students from the req body and inserts them to the db as well as creates
     * the necessary db table rows and relationships required for enrolments, labs and allocations.
     *
     * If the students already exist e.g. in another unit, it ignores creations of students and just
     * creates the labs allocations and enrolments for this unit
     *
     */
    const {
        unitCode,
        year,
        period,
    } = req.params;
    const requestBody = req.body;

    try {
        /* INSERT STUDENTS INTO DATABASE */
        // get the attributes we need and their values in prep for SQL queries
        //   e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
        const studentInsertData = requestBody.map(({ labCode, ...rest }) => {
          return Object.values(rest);
        });
        await insertStudents(studentInsertData);

        /* CREATE UNIT ENROLMENT BETWEEN STUDENTS AND UNIT */
        const studentEmails = requestBody.map((student) => student.email);
        const studentKeys = await selectStudentsKeys(studentEmails);
        const unitOffId = await selectUnitOffKey(unitCode, year, period);
        await insertStudentEnrolment(studentKeys, unitOffId);

        /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
        await insertUnitOffLabs(requestBody, unitOffId); // ensure lab no.s don't repeat in units
        await insertStudentLabAllocations(requestBody, unitOffId);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
    res.status(200).send();
};

const deleteStudentEnrolment = async (req, res) => {
    /**
     * Removes the student from the unit specified in the req body: this includes
     * their enrolment, lab and group allocations as well as personality test
     * attempts and results but not the student itself as it may be in other units
     *
     */
    const {
        unitCode,
        year,
        period,
        studentId,
    } = req.params;

    // remove all personality test RESULTS: belbin and effort
    await promiseBasedQuery(
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
    );

    await promiseBasedQuery(
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
    );

    // delete the personality test ATTEMPT
    await promiseBasedQuery(
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
    );

    // delete group allocation in this unit
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
    );

    // delete their lab allocation
    await promiseBasedQuery(
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
    );

    // delete their enrolment from this unit
    await promiseBasedQuery(
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
    );

    res.status(200).send();
};

const deleteStudentGroupAlloc = async (req, res) => {
    /**
     * Removes the student from the group in the unit specified in the req body:
     * this includes only their group allocations as this is only called when
     * the student and personality data is to be kept but the group changed.
     */

    const {
        unitCode,
        year,
        period,
        studentId,
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
    );

    res.status(200).send();
};

const addPersonalityData = async (req, res) => {
    /**
     * Takes a list containing a cohorts personality data of a certain personality type e.g.
     * belbin or effort from the req body and creates the necessary rows and associations.
     *
     */

    const { unitCode, year, period } = req.params;
    const { students, testType } = req.body;

    /* MAKE SURE ALL THE UNIT'S STUDENTS ARE ADDRESSED/PRESENT IN THE DATA BEING UPLOADED */
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
    );

    if (numEnrolledStudents !== students.length) {
        res.status(400).json({
          error: "personality data does not address all enrolled students",
        });
        return;
    }

    /* GET VALUES NEEDED FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
    const unitOffKey = await selectUnitOffKey(unitCode, year, period);
    const studentIds = students.map((student) => student.studentId);

    const studentIdKeyData = await promiseBasedQuery(
        "SELECT s.stud_unique_id, s.student_id FROM unit_enrolment e " +
        "   INNER JOIN unit_offering u ON u.unit_off_id = e.unit_off_id " +
        "   INNER JOIN student s ON s.stud_unique_id = e.stud_unique_id " +
        "WHERE " +
        "   u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "   AND s.student_id IN (?);",
        [unitCode, year, period, studentIds]
    );

    /* CONVERT VALUES INTO AN APPROPRIATE FORMAT FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
    // [[testType, unitOffKey, studentPrimaryKey], ...] for insert to personality_test_attempt
    const testAttemptInsertData = [];
    studentIdKeyData.forEach((student) => {
        testAttemptInsertData.push([testType, unitOffKey, student.stud_unique_id]);
    });

    /* INSERT PERSONALITY TEST ATTEMPT */
    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO personality_test_attempt (test_type, unit_off_id, stud_unique_id) " + "VALUES ?;",
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
    );

    /* call the specific strategy that will add this data to the database
       in accordance with its column requirements */
    addTestResultFunctionStrats[testType](personalityTestAttemptKeys, students);
    res.status(200).send();
};

const addStudentBelbin = async (personalityTestAttemptKeys, students) => {
    /**
     * Implements the logic required to add 'belbin' personality data to the
     * database given the unique column requirements it has.
     */
    const resultInsertData = [];
    // format the data so it fulfils the database column requirements
    personalityTestAttemptKeys.forEach((attempt) => {
        // find the student who made this attempt
        const [student] = students.filter((student) => {
            return student.studentId === attempt.student_id;
        });
        // add them to the array in the appropriate format
        resultInsertData.push([attempt.test_attempt_id, student.belbinType]);
    });

    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO belbin_result (personality_test_attempt, belbin_type) " + "VALUES ?;",
            [resultInsertData,]
        );
    } catch (err) {
        console.log(err);
    }
};

const addStudentEffort = async (personalityTestAttemptKeys, students) => {
    /**
     * Implements the logic required to add 'effort' personality data to the
     * database given the unique column requirements it has.
     */
    const resultInsertData = [];
    // format the data so it fulfils the database column requirements
    personalityTestAttemptKeys.forEach((attempt) => {
        // find the student who made this attempt
        const [student] = students.filter((student) => {
            return student.studentId === attempt.student_id;
        });
        // add their data in a suitable format
        resultInsertData.push([
            attempt.test_attempt_id,
            student.avgAssignmentMark,
            student.hourCommitment,
            student.avgAssignmentMark / student.hourCommitment,
        ]);
    });

    try {
        await promiseBasedQuery(
            "INSERT IGNORE INTO effort_result " +
            "(personality_test_attempt, assignment_avg, time_commitment_hrs, marks_per_hour) " +
            "VALUES ?;",
            [resultInsertData]
        );
    } catch (err) {
        console.log(err);
    }
};

const addTestResultFunctionStrats = {
    /**
     * A store of 'strategies' for adding different personality types with different
     * column requirements to the database.
     */
    belbin: addStudentBelbin,
    effort: addStudentEffort
};

module.exports = {
    getAllStudents,
    addAllStudents,
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    addPersonalityData,
};
