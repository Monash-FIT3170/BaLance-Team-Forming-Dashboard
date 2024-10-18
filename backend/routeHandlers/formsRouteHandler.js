const {
  getBelbinResponse,
  getEffortResponse,
  getPreferenceResponse,
  generateForms,
  closeForm,
  addStudentTimesAndPreferences,
  prepareTimesAndPreferencesData,
  getResponseCount,
} = require("../helpers/formsHelpers");
const {
  promiseBasedQuery,
  selectUnitOffKey,
} = require("../helpers/commonHelpers");
const { addTestResultFunctionStrats } = require("./studentRouteHandler.js");

const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();
``;

const SERVICE_ACCOUNT_JSON = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN
);
const SCOPES = [
  "https://www.googleapis.com/auth/forms",
  "https://www.googleapis.com/auth/drive",
];
const auth = new GoogleAuth({
  credentials: SERVICE_ACCOUNT_JSON,
  scopes: SCOPES,
});

const pushData = async (req, res) => {
  /**
   * Handles the push data request for a specific unit offering.
   *
   * @async
   * @function pushData
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the data has been processed and the response has been sent.
   *
   * @description
   * This function retrieves form data for a specific unit offering based on the provided unit code, year, and period.
   * It then processes the retrieved data to gather responses for different test types (belbin, effort, preference).
   * The processed data is then used to add personality data and student times and preferences to the database.
   */
  const { unitCode, year, period } = req.params;

  console.log("pushData called");

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
    const belbinFormId = results.find((result) => result.testType === "belbin");
    const projectFormId = results.find(
      (result) => result.testType === "preference"
    );
    const effortFormId = results.find((result) => result.testType === "effort");

    if (belbinFormId) {
      belbinResponse = await getBelbinResponse(auth, belbinFormId.formId);
    }
    if (effortFormId) {
      effortResponse = await getEffortResponse(auth, effortFormId.formId);
    }
    if (projectFormId) {
      projectResponse = await getPreferenceResponse(auth, projectFormId.formId);
    }
    if (effortFormId || belbinFormId) {
      personalityData = preparePersonalityData(belbinResponse, effortResponse);
      for (const data of personalityData) {
        addPersonalityData(
          data.students,
          data.testType,
          unitCode,
          year,
          period
        );
      }
    }
    if (projectResponse) {
      const projectData = await prepareTimesAndPreferencesData(
        projectResponse,
        unitCode,
        year,
        period
      );
      addStudentTimesAndPreferences(
        unitCode,
        year,
        period,
        projectData,
        "times"
      );
    }
  }
  res.status(200).json();
};

const getForm = async (name, unitCode, year, period, results) => {
  /**
   * Retrieves a form based on the provided parameters and augments it with response and student counts.
   *
   * @param {string} name - The name of the form.
   * @param {string} unitCode - The unit code associated with the form.
   * @param {number} year - The year associated with the form.
   * @param {string} period - The period associated with the form.
   * @param {Array} results - An array of form results to search through.
   * @returns {Promise<Object|null>} - A promise that resolves to the form object with additional counts, or null if not found.
   */
  let form = null;

  form = results.find((result) => result.testType === name.toLowerCase());
  if (form) {
    console.log("Counting responses");
    console.log(form.formId);
    let counts = await getResponseCount(form.formId, unitCode, year, period);

    form = {
      url: form.url,
      type: name,
      id: form.formId,
      responseCount: counts.responseCount,
      studentCount: counts.studentCount,
    };
  }
  return form;
};

const getForms = async (req, res) => {
  /**
   * Retrieves forms based on the provided unit code, year, and period.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
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

  let openForms = [];
  if (results.length > 0) {
    // We can't loop with awaits, so this is the next best thing
    let belbinResponse = await getForm(
      "Belbin",
      unitCode,
      year,
      period,
      results
    );
    let preferenceResponse = await getForm(
      "Preference",
      unitCode,
      year,
      period,
      results
    );
    let effortResponse = await getForm(
      "Effort",
      unitCode,
      year,
      period,
      results
    );

    if (belbinResponse) {
      openForms.push(belbinResponse);
    }
    if (preferenceResponse) {
      openForms.push(preferenceResponse);
    }
    if (effortResponse) {
      openForms.push(effortResponse);
    }
  }
  console.log(openForms);

  res.status(200).json(openForms);
};

const closeOpenForm = async (req, res) => {
  /**
   * Closes an open form and deletes its entry from the unit_form table.
   *
   * @async
   * @function closeOpenForm
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {string} req.params.year - The year.
   * @param {string} req.params.period - The period.
   * @param {Object} req.body - The request body.
   * @param {Object} req.body.id - The ID of the form to be closed.
   * @param {string} req.body.type - The type of the form to be closed.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the form is closed and deleted.
   */
  const { unitCode, year, period } = req.params;
  const formId = req.body;

  formStatus = await closeForm(auth, formId.id, formId.type);
  if (formStatus) {
    await promiseBasedQuery(
      "DELETE FROM unit_form " + "WHERE " + "   form_id=? ",
      [formId.id]
    );
    res.status(200).json();
  } else {
    res.status(500).json();
  }
};

const createForms = async (req, res) => {
  /**
   * Creates forms based on the provided unit code, year, and period.
   *
   * @async
   * @function createForms
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} req.body - The request body.
   * @param {Array} req.body.checkedItems - The list of checked items.
   * @param {number} req.body.preferenceCount - The number of preferences.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the forms are created.
   */
  const { unitCode, year, period } = req.params;
  const checkedItems = req.body.checkedItems;
  const projectCount = req.body.preferenceCount;

  console.log(checkedItems);
  console.log(projectCount);

  const [{ unitId }] = await promiseBasedQuery(
    "SELECT unit_off_id as unitId FROM unit_offering " +
      "WHERE " +
      "   unit_code=? " +
      "   AND unit_off_year=? " +
      "   AND unit_off_period=?; ",
    [unitCode, year, period]
  );
  generateForms(
    checkedItems[0],
    checkedItems[1],
    checkedItems[2],
    projectCount,
    unitId
  );

  res.status(200).json();
};

function preparePersonalityData(belbinResponses, effortResponses) {
  /**
   * Prepares personality data by mapping responses to structured objects.
   *
   * @param {Array} belbinResponses - An array of arrays where each inner array contains a student ID and a Belbin type.
   * @param {Array} effortResponses - An array of arrays where each inner array contains a student ID, hour commitment, and average assignment mark.
   * @returns {Array} An array containing two objects: one for Belbin data and one for effort data. Each object has a `students` property with the mapped data and a `testType` property indicating the type of test.
   */
  let belbinData = null;
  let effortData = null;
  if (belbinResponses) {
    belbinData = belbinResponses.map(([studentId, belbinType]) => ({
      studentId,
      belbinType,
    }));
  }
  if (effortResponses) {
    effortData = effortResponses.map(
      ([studentId, hourCommitment, avgAssignmentMark]) => ({
        studentId,
        hourCommitment,
        avgAssignmentMark,
      })
    );
  }

  const personalityData = [
    {
      students: belbinData,
      testType: "belbin",
    },
    {
      students: effortData,
      testType: "effort",
    },
  ];

  return personalityData;
}

const addPersonalityData = async (
  students,
  testType,
  unitCode,
  year,
  period
) => {
  /**
   * Adds personality data for students to the database.
   *
   * This function ensures that all students enrolled in a unit are accounted for in the provided data.
   * It then inserts personality test attempts and results into the database.
   *
   * @param {Array<Object>} students - An array of student objects containing personality data.
   * @param {string} testType - The type of personality test being recorded.
   * @param {string} unitCode - The code of the unit for which the data is being uploaded.
   * @param {number} year - The year of the unit offering.
   * @param {string} period - The period of the unit offering.
   * @returns {Promise<void>} - A promise that resolves when the data has been successfully added.
   */

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
    console.error(
      "Personality data does not match number of students in database."
    );
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

  console.log("here");
  console.log(unitCode);
  console.log(studentIdKeyData);

  /* CONVERT VALUES INTO AN APPROPRIATE FORMAT FOR INSERT QUERY FOR PERSONALITY_TEST_ATTEMPT */
  // [[testType, unitOffKey, studentPrimaryKey], ...] for insert to personality_test_attempt
  const testAttemptInsertData = [];
  studentIdKeyData.forEach((student) => {
    testAttemptInsertData.push([testType, unitOffKey, student.stud_unique_id]);
  });

  console.log(testAttemptInsertData);
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
  );

  /* call the specific strategy that will add this data to the database
       in accordance with its column requirements */
  addTestResultFunctionStrats[testType](personalityTestAttemptKeys, students);
};

module.exports = {
  pushData,
  createForms,
  getForms,
  closeOpenForm,
};
