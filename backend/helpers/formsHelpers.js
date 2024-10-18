const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { promiseBasedQuery, selectUnitOffKey } = require("./commonHelpers");
const {
  MAX_ACCESS_BOUNDARY_RULES_COUNT,
} = require("google-auth-library/build/src/auth/downscopedclient");
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

const formData = require("../data/forms.json");
const {
  populatepersonalityTestAttempt,
  populatePreferenceSubmission,
  populateProjectPreference,
} = require("../routeHandlers/studentRouteHandler.js");
const { batch } = require("googleapis/build/src/apis/batch/index.js");

let belbinFormId = null;
let belbinResponderURL = null;
let projectFormId = null;
let projectResponderURL = null;
let effortFormId = null;
let effortResponderURL = null;

async function closeForm(auth, formId, type) {
  /**
   * Closes a Google Form based on the provided form ID and type.
   *
   * @param {object} auth - The authentication object to get the client.
   * @param {string} formId - The ID of the form to be closed.
   * @param {string} type - The type of the form, either "Belbin" or another type.
   * @returns {Promise<boolean>} - Returns true if the form is closed successfully or if the form is not found, otherwise returns false.
   */
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  // Implemented form closing here
  const request =
    type == "Belbin" ? formData.closeBelbinForm : formData.closeForm;
  try {
    const response = await forms.forms.batchUpdate({
      formId,
      requestBody: {
        includeFormInResponse: true,
        requests: request,
      },
    });
    console.log("Form closed successfully: ", response.data);
    return true;
  } catch (error) {
    console.error(error);
    // Special case, handle form not found error
    if (error.status == 404) {
      return true;
    }
    return false;
  }
}

async function createForm(auth, formBody) {
  /**
   * Creates a new Google Form using the provided authentication and form body.
   *
   * @param {object} auth - The authentication object.
   * @param {object} formBody - The body of the form to be created.
   * @returns {Promise<object>} - A promise that resolves to the result of the form creation.
   */
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  const result = await forms.forms.create({ requestBody: formBody });
  return result;
}

async function updateForm(auth, formId, requests) {
  /**
   * Updates a Google Form with the specified requests.
   *
   * @param {object} auth - The authentication object.
   * @param {string} formId - The ID of the form to update.
   * @param {Array<object>} requests - The list of update requests to apply to the form.
   * @returns {Promise<void>} - A promise that resolves when the form is updated.
   * @throws {Error} - Throws an error if the form update fails.
   */
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  try {
    const response = await forms.forms.batchUpdate({
      formId,
      requestBody: {
        includeFormInResponse: true,
        requests: requests,
      },
    });

    console.log("Form updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating form:", error);
  }
}

function effortForm() {
  /**
   * Generates the structure for the Effort Allocation Survey form.
   *
   * @returns {Object} The form structure containing information about the survey.
   * @returns {Object} return.info - The information about the survey.
   * @returns {string} return.info.title - The title of the survey.
   * @returns {string} return.info.documentTitle - The document title of the survey.
   */
  return {
    info: {
      title: "Effort Allocation Survey",
      documentTitle: "Effort Allocation",
    },
  };
}

function projectPreferencesForm() {
  /**
   * Generates the project preferences form configuration.
   *
   * @returns {Object} The configuration object for the project preferences form.
   * @returns {Object} return.info - Information about the form.
   * @returns {string} return.info.title - The title of the form.
   * @returns {string} return.info.documentTitle - The document title of the form.
   */
  return {
    info: {
      title: "Project Preferences Survey",
      documentTitle: "Project Preferences",
    },
  };
}

function belbinForm() {
  /**
   * Generates the structure for the Belbin Team Roles Survey form.
   *
   * @returns {Object} An object containing the form information.
   * @returns {Object} return.info - Information about the form.
   * @returns {string} return.info.title - The title of the form.
   * @returns {string} return.info.documentTitle - The document title of the form.
   */
  return {
    info: {
      title: "Belbin Team Roles Survey",
      documentTitle: "Belbin Team Roles",
    },
  };
}

function generateProjectForm(projectCount) {
  /**
   * Generates a project form by adding questions and group selections to the project request.
   *
   * @param {number} projectCount - The number of projects to generate forms for.
   * @returns {Object} The updated project request with the added questions and group selections.
   */
  let projectRequest = formData.projectRequest;
  for (let i = 0; i < projectCount; i++) {
    let id = "2";
    let currentValue = i + 1;
    id = id + currentValue.toString();
    let questionJson = {
      questionId: id,
      required: true,
      rowQuestion: {
        title: currentValue.toString(),
      },
    };
    let groupSelectionJson = { value: currentValue.toString() };
    projectRequest[2].createItem.item.questionGroupItem.questions.push(
      questionJson
    );
    projectRequest[2].createItem.item.questionGroupItem.grid.columns.options.push(
      groupSelectionJson
    );
  }
  return projectRequest;
}

async function generateForms(belbin, effort, project, projectCount, unitId) {
  /**
   * Generates and updates forms based on the provided parameters and inserts form details into the database.
   *
   * @param {boolean} belbin - Indicates whether to generate a Belbin form.
   * @param {boolean} effort - Indicates whether to generate an Effort form.
   * @param {boolean} project - Indicates whether to generate a Project Preferences form.
   * @param {number} projectCount - The number of projects for the Project Preferences form.
   * @param {number} unitId - The unit ID to associate with the forms.
   * @returns {Promise<void>} - A promise that resolves when all forms are generated and updated.
   */
  if (effort) {
    var effortFormBody = effortForm();
    var effForm = await createForm(auth, effortFormBody);
    effortFormId = effForm.data.formId;
    effortResponderURL = effForm.data.responderUri;
    await updateForm(auth, effortFormId, formData.effortRequest);
    await promiseBasedQuery(
      "INSERT IGNORE INTO unit_form (unit_off_id, form_id, test_type, responder_url)" +
        "VALUES (?, ?, ?, ?);",
      [unitId, effortFormId, "effort", effortResponderURL]
    );
  }

  if (project) {
    var projectFormBody = projectPreferencesForm();
    var projForm = await createForm(auth, projectFormBody);
    projectFormId = projForm.data.formId;
    projectResponderURL = projForm.data.responderUri;
    const projectFormJSON = generateProjectForm(projectCount);
    await updateForm(auth, projectFormId, projectFormJSON);
    await promiseBasedQuery(
      "INSERT IGNORE INTO unit_form (unit_off_id, form_id, test_type, responder_url)" +
        "VALUES (?, ?, ?, ?);",
      [unitId, projectFormId, "preference", projectResponderURL]
    );
  }

  if (belbin) {
    var belbinFormBody = belbinForm();
    var belbForm = await createForm(auth, belbinFormBody);
    belbinFormId = belbForm.data.formId;
    belbinResponderURL = belbForm.data.responderUri;
    await updateForm(auth, belbinFormId, formData.belbinRequest);
    await promiseBasedQuery(
      "INSERT IGNORE INTO unit_form (unit_off_id, form_id, test_type, responder_url)" +
        "VALUES (?, ?, ?, ?);",
      [unitId, belbinFormId, "belbin", belbinResponderURL]
    );
  }
  console.log(belbinResponderURL, effortResponderURL, projectResponderURL);
}

//note: this can probably only fetch responses from forms the service account has access to, either send the form to the email or make the account create it using createForm.
async function getFormResponseList(auth, formId) {
  /**
   * Retrieves the list of responses for a specified Google Form.
   *
   * @param {object} auth - The authentication object used to authorize the request.
   * @param {string} formId - The ID of the Google Form for which to retrieve responses.
   * @returns {Promise<object>} A promise that resolves to the list of form responses.
   */
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  const responses = await forms.forms.responses.list({ formId });
  // console.log(JSON.stringify(responses.data.responses))
  return responses;
}

async function getFormResponse(auth, formId, responseId) {
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  const response = await forms.forms.responses.get({ formId, responseId });
  return response;
}

async function getForm(auth, formId) {
  const authClient = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: authClient });
  const form = await forms.forms.get({ formId });
}

async function prepareTimesAndPreferencesData(
  projectData,
  unitCode,
  year,
  period
) {
  /**
   * Prepares times and preferences data for students based on project data.
   *
   * example usage is getFormResponses(forms,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')
   * const responses = getFormResponseList(auth,'1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE')
   * const form = getForm(auth, "1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE")
   *
   * @param {Array} projectData - An array of project data entries, where each entry is an array containing student ID, timestamp, and preferences.
   * @param {string} unitCode - The unit code for the course.
   * @param {number} year - The year of the course offering.
   * @param {string} period - The period of the course offering.
   * @returns {Promise<Array>} A promise that resolves to an array of student data objects, each containing timestamp, email, full name, student ID, and project preferences.
   */
  const idsAndTimestamps = projectData.map((entry) => [entry[0], entry[1]]);
  const studentIds = idsAndTimestamps.map((entry) => entry[0]);

  console.log("mapped ids");

  studentData = await promiseBasedQuery(
    "SELECT s.student_id, s.email_address, CONCAT(s.preferred_name,' ', s.last_name) AS fullname " +
      "FROM student s " +
      "JOIN unit_enrolment ue ON s.stud_unique_id = ue.stud_unique_id " +
      "WHERE ue.unit_off_id = (" +
      "SELECT u.unit_off_id " +
      "FROM unit_offering u " +
      "WHERE u.unit_code = ? " +
      "AND u.unit_off_year = ? " +
      "AND u.unit_off_period = ?" +
      ") " +
      "AND s.student_id IN (?);",
    [unitCode, year, period, studentIds]
  );
  console.log(studentData);

  console.log("queried students");

  const result = projectData.map(([studentId, timestamp, ...preferences]) => {
    const studentInfo = studentData.find(
      (student) => student.student_id === studentId
    );

    // just in case the student id list returns no email / name
    const student = {
      timestamp: timestamp,
      email: studentInfo ? studentInfo.email_address : null,
      fullName: studentInfo ? studentInfo.fullname : null,
      studentId: studentId,
    };

    // Add preferences dynamically
    preferences.forEach((preference, index) => {
      student[`Project Preference ${index + 1}`] = preference;
    });

    return student;
  });

  return result;
}

async function getResponseCount(formId, unitCode, year, period) {
  /**
   * Retrieves the count of responses and the total number of students for a given form and unit offering.
   *
   * @param {string} formId - The ID of the form to retrieve responses from.
   * @param {string} unitCode - The code of the unit offering.
   * @param {number} year - The year of the unit offering.
   * @param {string} period - The period of the unit offering.
   * @returns {Promise<Object>} An object containing the response count and the total student count.
   * @property {number} responseCount - The number of responses from students enrolled in the unit offering.
   * @property {number} studentCount - The total number of students enrolled in the unit offering.
   */
  studentData = await promiseBasedQuery(
    "SELECT s.student_id " +
      "FROM student s " +
      "JOIN unit_enrolment ue ON s.stud_unique_id = ue.stud_unique_id " +
      "WHERE ue.unit_off_id = (" +
      "SELECT u.unit_off_id " +
      "FROM unit_offering u " +
      "WHERE u.unit_code = ? " +
      "AND u.unit_off_year = ? " +
      "AND u.unit_off_period = ?" +
      "); ",
    [unitCode, year, period]
  );
  const databaseIds = studentData.map((student) => student.student_id);
  const responses = await getFormResponseList(auth, formId);
  const studentIds = new Set(); // ensure list doesn't repeat student ids

  if (responses.data.responses) {
    responses.data.responses.map((response) => {
      let id = response.answers["00000001"].textAnswers.answers[0].value;
      console.log(id);
      if (databaseIds.includes(id)) {
        studentIds.add(id);
      }
    });
  }

  const count = {
    responseCount: studentIds.size,
    studentCount: databaseIds.length,
  };
  console.log(count);
  return count;
}

async function getBelbinResponse(auth, formId) {
  /**
   * Retrieves and processes Belbin responses from a form.
   *
   * @param {Object} auth - The authentication object required to access the form.
   * @param {string} formId - The ID of the form to retrieve responses from.
   * @returns {Promise<Array>} A promise that resolves to an array of arrays, where each inner array contains a student ID and their corresponding Belbin type.
   *
   * @example
   * const auth = { /* authentication details *\/ };
   * const formId = 'your-form-id';
   * getBelbinResponse(auth, formId).then(responseList => {
   *   console.log(responseList);
   * });
   */
  const belbinResponses = await getFormResponseList(auth, formId);
  let responseList = [];

  if (!belbinResponses.data.responses) {
    return;
  }

  for (let i = 0; i < belbinResponses.data.responses.length; i++) {
    const answer = belbinResponses.data.responses[i].answers;
    const studentId = answer["00000001"].textAnswers.answers[0].value;
    const ia = parseInt(answer["00000021"].textAnswers.answers[0].value, 10);
    const ib = parseInt(answer["00000022"].textAnswers.answers[0].value, 10);
    const ic = parseInt(answer["00000023"].textAnswers.answers[0].value, 10);
    const id = parseInt(answer["00000024"].textAnswers.answers[0].value, 10);
    const ie = parseInt(answer["00000025"].textAnswers.answers[0].value, 10);
    const iF = parseInt(answer["00000026"].textAnswers.answers[0].value, 10);
    const ig = parseInt(answer["00000027"].textAnswers.answers[0].value, 10);
    const ih = parseInt(answer["00000028"].textAnswers.answers[0].value, 10);

    const iia = parseInt(answer["00000031"].textAnswers.answers[0].value, 10);
    const iib = parseInt(answer["00000032"].textAnswers.answers[0].value, 10);
    const iic = parseInt(answer["00000033"].textAnswers.answers[0].value, 10);
    const iid = parseInt(answer["00000034"].textAnswers.answers[0].value, 10);
    const iie = parseInt(answer["00000035"].textAnswers.answers[0].value, 10);
    const iiF = parseInt(answer["00000036"].textAnswers.answers[0].value, 10);
    const iig = parseInt(answer["00000037"].textAnswers.answers[0].value, 10);
    const iih = parseInt(answer["00000038"].textAnswers.answers[0].value, 10);

    const iiia = parseInt(answer["00000040"].textAnswers.answers[0].value, 10);
    const iiib = parseInt(answer["00000041"].textAnswers.answers[0].value, 10);
    const iiic = parseInt(answer["00000042"].textAnswers.answers[0].value, 10);
    const iiid = parseInt(answer["00000043"].textAnswers.answers[0].value, 10);
    const iiie = parseInt(answer["00000044"].textAnswers.answers[0].value, 10);
    const iiiF = parseInt(answer["00000045"].textAnswers.answers[0].value, 10);
    const iiig = parseInt(answer["00000046"].textAnswers.answers[0].value, 10);
    const iiih = parseInt(answer["00000047"].textAnswers.answers[0].value, 10);

    const iva = parseInt(answer["00000051"].textAnswers.answers[0].value, 10);
    const ivb = parseInt(answer["00000052"].textAnswers.answers[0].value, 10);
    const ivc = parseInt(answer["00000053"].textAnswers.answers[0].value, 10);
    const ivd = parseInt(answer["00000054"].textAnswers.answers[0].value, 10);
    const ive = parseInt(answer["00000055"].textAnswers.answers[0].value, 10);
    const ivF = parseInt(answer["00000056"].textAnswers.answers[0].value, 10);
    const ivg = parseInt(answer["00000057"].textAnswers.answers[0].value, 10);
    const ivh = parseInt(answer["00000058"].textAnswers.answers[0].value, 10);

    const va = parseInt(answer["00000061"].textAnswers.answers[0].value, 10);
    const vb = parseInt(answer["00000062"].textAnswers.answers[0].value, 10);
    const vc = parseInt(answer["00000063"].textAnswers.answers[0].value, 10);
    const vd = parseInt(answer["00000064"].textAnswers.answers[0].value, 10);
    const ve = parseInt(answer["00000065"].textAnswers.answers[0].value, 10);
    const vF = parseInt(answer["00000066"].textAnswers.answers[0].value, 10);
    const vg = parseInt(answer["00000067"].textAnswers.answers[0].value, 10);
    const vh = parseInt(answer["00000068"].textAnswers.answers[0].value, 10);

    const via = parseInt(answer["00000071"].textAnswers.answers[0].value, 10);
    const vib = parseInt(answer["00000072"].textAnswers.answers[0].value, 10);
    const vic = parseInt(answer["00000073"].textAnswers.answers[0].value, 10);
    const vid = parseInt(answer["00000074"].textAnswers.answers[0].value, 10);
    const vie = parseInt(answer["00000075"].textAnswers.answers[0].value, 10);
    const viF = parseInt(answer["00000076"].textAnswers.answers[0].value, 10);
    const vig = parseInt(answer["00000077"].textAnswers.answers[0].value, 10);
    const vih = parseInt(answer["00000078"].textAnswers.answers[0].value, 10);

    const viia = parseInt(answer["00000081"].textAnswers.answers[0].value, 10);
    const viib = parseInt(answer["00000082"].textAnswers.answers[0].value, 10);
    const viic = parseInt(answer["00000083"].textAnswers.answers[0].value, 10);
    const viid = parseInt(answer["00000084"].textAnswers.answers[0].value, 10);
    const viie = parseInt(answer["00000085"].textAnswers.answers[0].value, 10);
    const viiF = parseInt(answer["00000086"].textAnswers.answers[0].value, 10);
    const viig = parseInt(answer["00000087"].textAnswers.answers[0].value, 10);
    const viih = parseInt(answer["00000088"].textAnswers.answers[0].value, 10);

    let IM = ig + iia + iiih + ivd + vb + viF + viie;
    let CO = id + iib + iiia + ivh + vF + vic + viig;
    let SH = iF + iie + iiic + ivb + vd + vig + viia;
    let PL = ic + iig + iiid + ive + vh + via + viF;
    let RI = ia + iic + iiiF + ivg + ve + vih + viid;
    let ME = ih + iid + iiig + ivc + va + vie + viib;
    let TW = ib + iiF + iiie + iva + vc + vib + viih;
    let CF = ie + iih + iiib + ivF + vg + vid + viic;

    let attributes = [
      ["IM", IM],
      ["CO", CO],
      ["SH", SH],
      ["PL", PL],
      ["RI", RI],
      ["ME", ME],
      ["TW", TW],
      ["CF", CF],
    ];
    console.log(attributes);

    let max_value = 0;
    let max_attribute = null;

    for (let j = 0; j < attributes.length; j++) {
      if (attributes[j][1] > max_value) {
        max_attribute = attributes[j][0];
      }
    }

    let belbin_type = null;

    if (max_attribute == "PL" || max_attribute == "ME") {
      belbin_type = "Thinking";
    } else if (
      max_attribute == "SH" ||
      max_attribute == "IM" ||
      max_attribute == "CF"
    ) {
      belbin_type = "Action";
    } else if (
      max_attribute == "CO" ||
      max_attribute == "TW" ||
      max_attribute == "RI"
    ) {
      belbin_type = "People";
    }

    responseList.push([studentId, belbin_type]);
  }

  // console.log(responseList);
  return responseList;
}

async function getEffortResponse(auth, formId) {
  /**
   * Retrieves and processes effort responses from a form.
   *
   * @param {Object} auth - The authentication object required to access the form.
   * @param {string} formId - The ID of the form to retrieve responses from.
   * @returns {Promise<Array>} A promise that resolves to an array of effort responses,
   *                           where each response is an array containing student ID, effort hours, and a fixed value of 70.
   */
  const effortResponses = await getFormResponseList(auth, formId);
  let responseList = [];

  if (!effortResponses.data.responses) {
    return;
  }

  for (let i = 0; i < effortResponses.data.responses.length; i++) {
    const answer = effortResponses.data.responses[i].answers;
    const studentId = answer["00000001"].textAnswers.answers[0].value;
    const effortHours = answer["00000002"].textAnswers.answers[0].value;

    responseList.push([studentId, effortHours, 70]);
  }

  return responseList;
}

async function getPreferenceResponse(auth, formId) {
  /**
   * Retrieves and processes preference responses from a form.
   *
   * @param {Object} auth - The authentication object required to access the form.
   * @param {string} formId - The ID of the form to retrieve responses from.
   * @returns {Promise<Array>} A promise that resolves to an array of responses,
   *                           where each response is an array containing the student ID,
   *                           last submitted time, and their preferences.
   */
  const projectPreferencesResponses = await getFormResponseList(auth, formId);
  let responseList = [];

  if (!projectPreferencesResponses.data.responses) {
    return;
  }
  console.log("getting preference responses");

  for (let i = 0; i < projectPreferencesResponses.data.responses.length; i++) {
    const answer = projectPreferencesResponses.data.responses[i].answers;
    const lastSubmittedTime =
      projectPreferencesResponses.data.responses[i].lastSubmittedTime;
    const studentId = answer["00000001"].textAnswers.answers[0].value;

    let response = [studentId, lastSubmittedTime];

    let answerNo = 1;
    // Get next preference answer ID, add it if it exists
    while (true) {
      let idBase = "00000000"; // answers have the form '...0002n', left-padded with 0s to 8 chars
      let id = answerNo.toString();
      id = "2" + id;
      id = idBase.substring(0, 8 - id.length) + id;
      if (answer.hasOwnProperty(id)) {
        response.push(answer[id].textAnswers.answers[0].value);
      } else {
        break;
      }
      answerNo = answerNo + 1;
    }

    responseList.push(response);
  }

  return responseList;
}

const addStudentTimesAndPreferences = async (
  unitCode,
  year,
  period,
  students,
  testType
) => {
  /**
   * Adds student times and preferences to the database.
   *
   * @param {string} unitCode - The code of the unit.
   * @param {number} year - The year of the unit.
   * @param {string} period - The period of the unit.
   * @param {Array<Object>} students - An array of student objects containing their preferences.
   * @param {string} testType - The type of test.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   *
   * @throws Will throw an error if the database operations fail.
   */
  // check how many preferences each student has submitted
  const numberOfPreferencesForEachStudent = students.map((student) => {
    const { timestamp, email, fullName, studentId, ...preferences } = student;
    return Object.keys(preferences).length;
  });

  console.log(numberOfPreferencesForEachStudent);

  // get the maximum number of preferences submitted by a student
  const maxPreferences = Math.max(...numberOfPreferencesForEachStudent);
  // validate that each student has submitted the same number of preferences
  const filteredStudents = students.filter((student) => {
    // return only if the student has submitted maxPreferences number of preferences
    const { timestamp, email, fullName, studentId, ...preferences } = student;
    return Object.keys(preferences).length === maxPreferences;
  });
  try {
    await populatepersonalityTestAttempt(
      filteredStudents,
      unitCode,
      year,
      period,
      testType
    );
    await populatePreferenceSubmission(filteredStudents);
    await populateProjectPreference(filteredStudents, unitCode);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBelbinResponse,
  getEffortResponse,
  getPreferenceResponse,
  generateForms,
  closeForm,
  addStudentTimesAndPreferences,
  prepareTimesAndPreferencesData,
  getResponseCount,
};
