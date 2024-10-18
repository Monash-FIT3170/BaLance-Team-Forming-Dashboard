/**
 * This module should only contain functions that handle routes related
 * to students and student data
 *
 */

const {
  promiseBasedQuery,
  selectUnitOffKey,
} = require("../helpers/commonHelpers");

const {
  insertStudents,
  selectStudentsKeys,
  insertStudentEnrolment,
  insertUnitOffLabs,
  insertStudentLabAllocations,
} = require("../helpers/studentRouteHandlerHelpers");

const getAllStudents = async (req, res) => {
  /**
   * Retrieves all students in a specified unit from the database, including their group and lab number information.
   * Requires student group and lab num to be included as well as if group is null.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The unit code to filter students by.
   * @param {number} req.params.year - The year to filter students by.
   * @param {string} req.params.period - The period to filter students by.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the students' data.
   */
  const { unitCode, year, period } = req.params;

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
   * @async
   * @function addAllStudents
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit.
   * @param {string} req.params.period - The period of the unit.
   * @param {Object} req.body - The request body containing the list of students.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if the operation fails.
   */
  const { unitCode, year, period } = req.params;
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
   * Asynchronously deletes a student's enrolment and related data from a specified unit.
   *
   * This function performs the following operations:
   * - Removes all personality test results (both effort and Belbin) for the student in the specified unit.
   * - Deletes the personality test attempts for the student in the specified unit.
   * - Deletes the student's group allocation in the specified unit.
   * - Deletes the student's lab allocation in the specified unit.
   * - Deletes the student's enrolment from the specified unit.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The code of the unit.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {string} req.params.studentId - The ID of the student.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const { unitCode, year, period, studentId } = req.params;

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
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The code of the unit.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {string} req.params.studentId - The ID of the student.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */

  const { unitCode, year, period, studentId } = req.params;

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
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} req.body - The request body.
   * @param {Array<Object>} req.body.students - The list of students with their personality data.
   * @param {string} req.body.testType - The type of personality test.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   *
   * @throws {Error} - Throws an error if the personality data does not address all enrolled students.
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
  res.status(200).send();
};

const addStudentBelbin = async (personalityTestAttemptKeys, students) => {
  /**
   * Adds 'belbin' personality data to the database.
   *
   * @param {Array} personalityTestAttemptKeys - An array of objects representing personality test attempts.
   * @param {Array} students - An array of student objects.
   * @returns {Promise<void>} - A promise that resolves when the data has been inserted into the database.
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
      "INSERT IGNORE INTO belbin_result (personality_test_attempt, belbin_type) " +
        "VALUES ?;",
      [resultInsertData]
    );
  } catch (err) {
    console.log(err);
  }
};

const addStudentEffort = async (personalityTestAttemptKeys, students) => {
  /**
   * Adds 'effort' personality data to the database.
   *
   * @param {Array} personalityTestAttemptKeys - An array of objects representing effort test attempts.
   * @param {Array} students - An array of student objects.
   * @returns {Promise<void>} - A promise that resolves when the data has been inserted into the database.
   */
  const resultInsertData = [];

  // Extract all student IDs from the attempts
  const studentIds = [
    ...new Set(personalityTestAttemptKeys.map((attempt) => attempt.student_id)),
  ];

  // Fetch wam_val for all students in one query
  let wamValues = {};
  try {
    const wamResults = await promiseBasedQuery(
      "SELECT student_id, wam_val FROM student WHERE student_id IN (?);",
      [studentIds]
    );

    // Map wam_val results to a dictionary for quick access
    wamResults.forEach(({ student_id, wam_val }) => {
      wamValues[student_id] = wam_val;
    });
  } catch (err) {
    console.error("Error fetching wam_val for students:", err);
    return; // Exit if there's an error
  }

  // Format the data for insertion
  personalityTestAttemptKeys.forEach((attempt) => {
    const avgAssignmentMark = wamValues[attempt.student_id];

    if (avgAssignmentMark !== undefined) {
      const student = students.find((s) => s.studentId === attempt.student_id);

      if (student) {
        let timeCommitment = student.hourCommitment;
        // Prevents division by zero
        if (timeCommitment < 1) {
          timeCommitment = 1;
        }

        // Add their data in a suitable format
        resultInsertData.push([
          attempt.test_attempt_id,
          avgAssignmentMark,
          timeCommitment,
          avgAssignmentMark / timeCommitment,
        ]);
      } else {
        console.log(
          `No student found for attempt ID: ${attempt.test_attempt_id}`
        );
      }
    } else {
      console.log(`No wam_val found for student ID: ${attempt.student_id}`);
    }
  });

  // Insert the data into the effort_result table
  if (resultInsertData.length > 0) {
    try {
      await promiseBasedQuery(
        "INSERT IGNORE INTO effort_result " +
          "(personality_test_attempt, assignment_avg, time_commitment_hrs, marks_per_hour) " +
          "VALUES ?;",
        [resultInsertData]
      );
    } catch (err) {
      console.error("Error inserting into effort_result:", err);
    }
  } else {
    console.log("No data to insert into effort_result.");
  }
};

const addStudentPreferences = async (personalityTestAttemptKeys, students) => {
  /**
   * Implements the logic required to add 'Preferences' personality data to the
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
      student.submission_timestamp,
    ]);
  });

  try {
    await promiseBasedQuery(
      "INSERT IGNORE INTO preference_submission" +
        "(personality_test_attempt, submission_timestamp) " +
        "VALUES ?;",
      [resultInsertData]
    );
  } catch (err) {
    console.log(err);
  }

  // is this it?
  // addProjectPreferences(personalityTestAttemptKeys, students)
};

const addProjectPreferences = async (personalityTestAttemptKey, students) => {
  /**
   * Implements the logic for adding each project preference to a given preference submission
   */
  const resultInsertData = [];
  // format the data so it fulfils the database column requirements
  // For each student
  personalityTestAttemptKeys.forEach(async (attempt) => {
    // find the student who made this attempt
    const [student] = students.filter((student) => {
      return student.studentId === attempt.student_id;
    });

    // get the preference submission ID
    let preference_submission_id;
    try {
      const [{ preference_submission_id: id }] = await promiseBasedQuery(
        "SELECT preference_submission_id FROM preference_submission WHERE personality_test_attempt=?;",
        [attempt.test_attempt_id]
      );
      preference_submission_id = id;
    } catch (err) {
      console.log(err);
    }

    // Turning the string preferences into an array of numbers
    const preferencesArray = student.preferences.split(" ").map(Number);

    // Gather data for each project
    for (let i = 0; i < preferencesArray.length; i++) {
      resultInsertData.push([preference_submission_id, i, preferencesArray[i]]);
    }

    // Perform a single insert for all projects
    try {
      await promiseBasedQuery(
        "INSERT IGNORE INTO project_preference " +
          "(preference_submission_id, project_number, preference_rank) " +
          "VALUES ?;",
        [resultInsertData]
      );
    } catch (err) {
      console.log(err);
    }
  });
  //TODO: check if the above is correct
};

async function populatepersonalityTestAttempt(
  students,
  unitCode,
  year,
  period,
  testType
) {
  /**
   * Populates the personality test attempt data for a list of students.
   *
   * @param {Array<Object>} students - An array of student objects.
   * @param {string} students[].email - The email of the student.
   * @param {string} unitCode - The unit code.
   * @param {number} year - The year of the unit offering.
   * @param {string} period - The period of the unit offering.
   * @param {string} testType - The type of the personality test.
   * @returns {Promise<void>} - A promise that resolves when the data has been inserted.
   */
  const unitOffId = await selectUnitOffKey(unitCode, year, period);
  const studentEmails = students.map((student) => student.email);
  const studentKeys = await selectStudentsKeys(studentEmails);
  const testTypeConst = testType;
  const testAttemptInsertData = [];
  studentKeys.forEach((student) => {
    testAttemptInsertData.push([testType, unitOffId, student.stud_unique_id]);
  });
  await promiseBasedQuery(
    "INSERT IGNORE INTO personality_test_attempt (test_type, unit_off_id, stud_unique_id) " +
      "VALUES ?;",
    [testAttemptInsertData]
  );
}

async function populatePreferenceSubmission(students) {
  /**
   * Populates the preference submission table with the provided students' data.
   *
   * @param {Array<Object>} students - An array of student objects.
   * @param {string} students[].email - The email of the student.
   * @param {string} students[].timestamp - The timestamp of the student's submission.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const studentEmails = students.map((student) => student.email);
  const studentKeys = (await selectStudentsKeys(studentEmails)).map(
    (student) => student.stud_unique_id
  );
  const testAttemptKeys = await promiseBasedQuery(
    "SELECT test_attempt_id FROM personality_test_attempt WHERE stud_unique_id IN (?);",
    [studentKeys]
  );
  const testAttemptKeysArray = testAttemptKeys.map(
    (testAttempt) => testAttempt.test_attempt_id
  );
  const submissionTimestamps = students.map((student) =>
    new Date(student.timestamp).toISOString().slice(0, 19).replace("T", " ")
  );
  const submissionData = testAttemptKeysArray.map((testAttempt, index) => [
    testAttempt,
    submissionTimestamps[index],
  ]);
  await promiseBasedQuery(
    "INSERT IGNORE INTO preference_submission (personality_test_attempt, submission_timestamp) " +
      "VALUES ?;",
    [submissionData]
  );
  console.log(submissionData);
}

async function populateProjectPreference(students, unitCode) {
  /**
   * Populates project preferences for a list of students based on their email addresses and unit code.
   *
   * This function performs the following steps:
   * 1. Extracts student emails and retrieves their unique IDs.
   * 2. Retrieves the unit offering ID for the given unit code.
   * 3. Retrieves test attempt IDs for the students within the unit offering.
   * 4. Extracts and processes project preferences from the student data.
   * 5. Retrieves preference submission IDs based on the test attempt IDs.
   * 6. Constructs project preference data for insertion into the database.
   * 7. Inserts the project preference data into the `project_preference` table.
   *
   * @param {Array<Object>} students - An array of student objects containing their details and preferences.
   * @param {string} unitCode - The unit code for which the project preferences are being populated.
   * @returns {Promise<void>} - A promise that resolves when the project preferences have been successfully populated.
   */
  const studentEmails = students.map((student) => student.email);
  const studentKeys = (await selectStudentsKeys(studentEmails)).map(
    (student) => student.stud_unique_id
  );
  const unit_offering_id = await promiseBasedQuery(
    "SELECT unit_off_id FROM unit_offering where unit_code = ?;",
    [unitCode]
  );
  const unit_off_id = unit_offering_id[0].unit_off_id;
  console.log(unit_off_id);
  const testAttemptKeys = await promiseBasedQuery(
    "SELECT test_attempt_id FROM personality_test_attempt WHERE stud_unique_id IN (?) and unit_off_id=?;",
    [studentKeys, unit_off_id]
  );
  const testAttemptKeysArray = testAttemptKeys.map(
    (testAttempt) => testAttempt.test_attempt_id
  );
  console.log("Test Attempt Keys Array: ", testAttemptKeysArray);
  const projectPreferences = students.map((student) => {
    const { timestamp, email, fullName, studentId, ...preferences } = student;
    return preferences;
  });
  const projectPreferencesArray = projectPreferences.map((preferences) => {
    const preferenceKeys = Object.keys(preferences)
      .map((key) => parseInt(key.replace("Project Preference ", ""), 10)) // Extract the number and convert to integer
      .sort((a, b) => a - b); // Sort numerically
    return preferenceKeys
      .map((key) => preferences[`Project Preference ${key}`])
      .map(Number);
  });

  console.log("Project Preference Array", projectPreferencesArray);

  const preferenceSubmissionKeys = await promiseBasedQuery(
    "SELECT preference_submission_id FROM preference_submission WHERE personality_test_attempt IN (?);",
    [testAttemptKeysArray]
  );
  console.log(preferenceSubmissionKeys);
  const preferenceSubmissionKeysArray = preferenceSubmissionKeys.map(
    (submission) => submission.preference_submission_id
  );
  console.log(preferenceSubmissionKeysArray);
  const minimumKey = Math.min(...preferenceSubmissionKeysArray);
  console.log(minimumKey);
  const projectPreferenceData = preferenceSubmissionKeysArray
    .map((submission, index) => {
      const preferences = projectPreferencesArray[submission - minimumKey];
      return preferences
        ? preferences.map((preference, rank) => [
            submission,
            rank + 1,
            preference,
          ])
        : null;
    })
    .filter((data) => data !== null)
    .flat(1);
  console.log("Project Preference Data:");
  console.log(projectPreferenceData);
  await promiseBasedQuery(
    "INSERT IGNORE INTO project_preference (preference_submission_id, project_number, preference_rank) " +
      "VALUES ?;",
    [projectPreferenceData]
  );
}

const addStudentTimesAndPreferences = async (req, res) => {
  /**
   * Handles the addition of student times and preferences.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year.
   * @param {string} req.params.period - The period.
   * @param {Object} req.body - The request body.
   * @param {Array<Object>} req.body.students - The list of students.
   * @param {string} req.body.testType - The type of test.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  // read the data from the request
  const { unitCode, year, period } = req.params;
  const { students, testType } = req.body;

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
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
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

module.exports = {
  getAllStudents,
  addAllStudents,
  deleteStudentEnrolment,
  deleteStudentGroupAlloc,
  addPersonalityData,
  addStudentTimesAndPreferences,
  addTestResultFunctionStrats,
  populatepersonalityTestAttempt,
  populatePreferenceSubmission,
  populateProjectPreference,
};
