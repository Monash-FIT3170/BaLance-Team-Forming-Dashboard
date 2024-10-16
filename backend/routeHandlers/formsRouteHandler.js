const { getBelbinResponse, getEffortResponse, getPreferenceResponse, generateForms, closeForm, addStudentTimesAndPreferences, prepareTimesAndPreferencesData } = require('../helpers/formsHelpers');
const { promiseBasedQuery, selectUnitOffKey } = require("../helpers/commonHelpers");
const { addTestResultFunctionStrats } = require("./studentRouteHandler.js");

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

    const results = await promiseBasedQuery(
        "SELECT form_id AS formId, test_type as testType " +
        "FROM unit_form " +
        "WHERE unit_off_id = ( " +
        "    SELECT unit_off_id " +
        "    FROM unit_offering " +
        "    WHERE UPPER(unit_code) = UPPER(?) " +
        "       AND unit_off_year = ?" +
        "       AND unit_off_period = ?" +
        ")",
        [unitCode, year, period]
    );
    console.log(results);
    let belbinResponse = null;
    let effortResponse = null;
    let projectResponse = null;
    if (results.length > 0) {

        const belbinFormId = results.find(result => result.testType === 'belbin');
        const projectFormId = results.find(result => result.testType === 'preference');
        const effortFormId = results.find(result => result.testType === 'effort');

        if (belbinFormId){
            belbinResponse = await getBelbinResponse(auth, belbinFormId.formId)
        }
        if (effortFormId) {
            effortResponse = await getEffortResponse(auth, effortFormId.formId)
        }
        if (projectFormId) {
            projectResponse = await getPreferenceResponse(auth, projectFormId.formId)
        }
        if (effortFormId || belbinFormId){
            personalityData = preparePersonalityData(belbinResponse, effortResponse)
            for (const data of personalityData) {
                addPersonalityData(data.students, data.testType, unitCode, year, period)
            }
        }
        if (projectResponse) {
            const projectData = await prepareTimesAndPreferencesData(projectResponse, unitCode, year, period)
            addStudentTimesAndPreferences(unitCode, year, period, projectData, 'times')
        }
    }
    res.status(200).json();
};

const getForms = async (req, res) => {

    const { unitCode, year, period } = req.params;

    const results = await promiseBasedQuery(
        "SELECT form_id AS formId, test_type as testType, responder_url as url " +
        "FROM unit_form " +
        "WHERE unit_off_id = ( " +
        "    SELECT unit_off_id " +
        "    FROM unit_offering " +
        "    WHERE UPPER(unit_code) = UPPER(?) " +
        "       AND unit_off_year = ?" +
        "       AND unit_off_period = ?" +
        ")",
        [unitCode, year, period]
    );
    
    console.log(results);

    let belbinResponse = null;
    let effortResponse = null;
    let projectResponse = null;

    let formTypes = ['Belbin', 'Preference', 'Effort'];
    let openForms = []
    if (results.length > 0) {
        formTypes.forEach(name => {
            form = results.find(result => result.testType === name.toLowerCase());
            if (form) {
                openForms.push({
                    url: form.url,
                    type: name,
                    id: form.formId
                })
            }
        });
    }
    console.log(openForms)

    res.status(200).json(openForms);
}

const closeOpenForm = async (req, res) => {
    const { unitCode, year, period } = req.params;
    const formId = req.body;

    await promiseBasedQuery(
        "DELETE FROM unit_form " +
        "WHERE " +
        "   form_id=? ",
        [formId.id]
    )
    closeForm(auth, formId.id);
    res.status(200).json();
}

const createForms = async (req, res) => {
    const { unitCode, year, period } = req.params;
    const checkedItems = req.body.checkedItems;
    const projectCount = req.body.preferenceCount;

    console.log(checkedItems)
    console.log(projectCount)

    const [{ unitId }] = await promiseBasedQuery(
        "SELECT unit_off_id as unitId FROM unit_offering " +
        "WHERE " +
        "   unit_code=? " +
        "   AND unit_off_year=? " +
        "   AND unit_off_period=?; ",
        [unitCode, year, period]
    );
    generateForms(checkedItems[0], checkedItems[1], checkedItems[2], projectCount, unitId);

    res.status(200).json();
}


function preparePersonalityData(belbinResponses, effortResponses) {
    let belbinData = null;
    let effortData = null;
    if (belbinResponses) {
        belbinData = belbinResponses.map(([studentId, belbinType]) => ({
        studentId,
        belbinType,
        }));
    }
    if (effortResponses) {
        effortData = effortResponses.map(([studentId, hourCommitment, avgAssignmentMark]) => ({
        studentId,
        hourCommitment,
        avgAssignmentMark,
        }));
    }

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

    if (!students) {
        return;
    }
    if (numEnrolledStudents > students.length) {
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

module.exports =  { pushData, createForms, getForms, closeOpenForm };