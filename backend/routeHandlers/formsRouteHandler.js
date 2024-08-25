const { getBelbinResponse, getEffortResponse, getPreferenceResponse } = require('../helpers/formsHelpers');
const { promiseBasedQuery, selectUnitOffKey } = require("../helpers/commonHelpers");

const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();``

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN )
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT_JSON,
    scopes: SCOPES,
});

const pushData = async (req, res) => {
    /**
     * Pushes data from google forms into the database
     *
     */

    const { unitCode, year, period } = req.params;

    console.log("pushData called")

    const belbinResponse = await getBelbinResponse(auth, '1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE')
    const effortResponse = await getEffortResponse(auth, '1gaVlsQARmiYYTmgr3wezZdWFJxVcyrWAaFpX5QleVy8')
    console.log(belbinResponse)

    personalityData = preparePersonalityData(belbinResponse, effortResponse)

    for (const data of personalityData) {
        addPersonalityData(data.students, data.testType, unitCode, year, period)
    }

    res.status(200).json();
};

function preparePersonalityData(belbinResponses, effortResponses) {
    console.log(belbinResponses)
    const belbinData = belbinResponses.map(([studentId, belbinType]) => ({
      studentId,
      belbinType,
    }));
    const effortData = effortResponses.map(([studentId, hourCommitment, avgAssignmentMark]) => ({
      studentId,
      hourCommitment,
      avgAssignmentMark,
    }));
  
    const personalityData = [
      {
        students: belbinData,
        testType: 'belbin'
      },
      {
        students: effortData,
        testType: 'effort'
      }
    ];
  
    return personalityData
  }

const addPersonalityData = async(students, testType, unitCode, year, period) => {
    
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
        console.error("Personality data does not match number of students in database.")
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

    console.log("here")
    console.log(unitCode)
    console.log(studentIdKeyData)

    /* CONVERT VALUES INTO AN APPROPRIATE FORMAT FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
    // [[testType, unitOffKey, studentPrimaryKey], ...] for insert to personality_test_attempt
    const testAttemptInsertData = [];
    studentIdKeyData.forEach((student) => {
        testAttemptInsertData.push([testType, unitOffKey, student.stud_unique_id]);
    });

    console.log(testAttemptInsertData)
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
}

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
    effort: addStudentEffort,
    // the format of data is quite different, we can make it modular later.
    // preference: addStudentPreferences
};

module.exports =  { pushData };