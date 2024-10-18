/**
 * This module should only contain functions that handle routes related
 * to the custom script feature
 *
 */

const { spawn } = require("child_process");

const {
  promiseBasedQuery,
  selectUnitOffKey,
} = require("../helpers/commonHelpers");

async function storeGroupsInDatabase(unitCode, year, period, parsedOutput) {
  /**
   * Stores groups in the database based on the provided unit code, year, period, and parsed output.
   *
   * @param {string} unitCode - The unit code for the course.
   * @param {number} year - The year of the course offering.
   * @param {string} period - The period of the course offering.
   * @param {Object} parsedOutput - The parsed output containing student group information.
   * @throws {Error} If the unit code, year, or period provided is invalid.
   * @returns {Promise<void>} A promise that resolves when the groups and allocations are stored in the database.
   */
  const unitOffIdResult = await promiseBasedQuery(
    "SELECT unit_off_id FROM unit_offering " +
      "WHERE unit_code = ? AND unit_off_year = ? AND unit_off_period = ?",
    [unitCode, year, period]
  );

  if (!unitOffIdResult.length)
    throw new Error("Invalid unit code, year, or period provided.");

  const unitOffId = await selectUnitOffKey(unitCode, year, period);

  const students = await promiseBasedQuery(
    "SELECT stud.stud_unique_id, alloc.unit_off_lab_id " +
      "FROM student stud " +
      "INNER JOIN student_lab_allocation alloc ON stud.stud_unique_id=alloc.stud_unique_id " +
      "INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=alloc.unit_off_lab_id " +
      "INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id " +
      "WHERE " +
      "   unit.unit_code=? " +
      "   AND unit.unit_off_year=? " +
      "   AND unit.unit_off_period=? " +
      "ORDER BY unit_off_lab_id;",
    [unitCode, year, period]
  );

  var labStudents = {};
  labStudents = await transformParsedOutput(parsedOutput);

  const groupInsertData = [];
  let numGroups = 0;
  for (let labId in labStudents) {
    /* INSERT THE NEW GROUPS INTO THE DATABASE */
    // determine the number of groups to be inserted to database -> inserted as [unit_off_lab_id, group_number]
    labStudents[labId].forEach((student) => {
      numGroups++;
      groupInsertData.push([labId, numGroups]);
    });

    await promiseBasedQuery(
      "INSERT IGNORE INTO lab_group (unit_off_lab_id, group_number) VALUES ?;",
      [groupInsertData]
    );

    /* INSERT THE ALLOCATIONS TO GROUPS INTO THE DATABASE */
    // get all groups in this unit as [ >> group_id <<, lab_id]
    const groupAllocInsertData = [];
    const groupData = await promiseBasedQuery(
      "SELECT g.lab_group_id, g.unit_off_lab_id " +
        "FROM lab_group g " +
        "INNER JOIN unit_off_lab l ON g.unit_off_lab_id=l.unit_off_lab_id " +
        "INNER JOIN unit_offering u ON u.unit_off_id=l.unit_off_id " +
        "WHERE " +
        "   u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
      [unitCode, year, period]
    );

    // for each group, pop a group from the lab key in object and form the allocation
    for (let i = 0; i < numGroups; i++) {
      const group = groupData.pop();
      const groupStudents = labStudents[group.unit_off_lab_id].pop();

      if (groupStudents === undefined) {
        break;
      } else {
        groupStudents.forEach((studentId) => {
          groupAllocInsertData.push([studentId, group.lab_group_id]);
        });
      }
    }

    // student allocations are created as [~~group_alloc_id~~, stud_unique_id, lab_group_id]
    await promiseBasedQuery(
      "INSERT IGNORE INTO group_allocation (stud_unique_id, lab_group_id) VALUES ?;",
      [groupAllocInsertData]
    );
  }
}

async function getUnitStudentData(unitCode, year, period) {
  /**
   * Retrieves student data for a specific unit offering.
   *
   * @param {string} unitCode - The code of the unit.
   * @param {number} year - The year of the unit offering.
   * @param {string} period - The period of the unit offering.
   * @returns {Promise<Object[]>} A promise that resolves to an array of student data objects.
   */
  return await promiseBasedQuery(
    "SELECT stud.stud_unique_id, stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val " +
      "FROM student stud " +
      "INNER JOIN unit_enrolment ue ON ue.stud_unique_id = stud.stud_unique_id " +
      "INNER JOIN unit_offering unit ON ue.unit_off_id = unit.unit_off_id " +
      "WHERE unit.unit_code = ? AND unit.unit_off_year = ? AND unit.unit_off_period = ?",
    [unitCode, year, period]
  );
}

async function getLabsInUnit(unit_off_id) {
  /**
   * Retrieves the lab IDs associated with a given unit offering ID.
   *
   * @param {number} unit_off_id - The ID of the unit offering.
   * @returns {Promise<Array>} A promise that resolves to an array of lab IDs.
   */
  return await promiseBasedQuery(
    "SELECT unit_off_lab_id FROM unit_off_lab WHERE unit_off_id = ?",
    [unit_off_id]
  );
}

async function getUnitOffId(unit_code) {
  /**
   * Retrieves the unit offering ID for a given unit code.
   *
   * @param {string} unit_code - The code of the unit to retrieve the offering ID for.
   * @returns {Promise<Object>} A promise that resolves to an object containing the unit offering ID.
   */
  return await promiseBasedQuery(
    "SELECT unit_off_id FROM unit_offering WHERE unit_code = ?",
    [unit_code]
  );
}

async function getStudedntsInLab(unit_off_lab_id) {
  /**
   * Retrieves the list of student unique IDs allocated to a specific lab.
   *
   * @param {number} unit_off_lab_id - The unique identifier for the lab unit offering.
   * @returns {Promise<Array<{ stud_unique_id: number }>>} A promise that resolves to an array of objects containing student unique IDs.
   */
  return await promiseBasedQuery(
    "SELECT stud_unique_id FROM student_lab_allocation WHERE unit_off_lab_id = ?",
    [unit_off_lab_id]
  );
}

async function getStudentData(stud_unique_id) {
  /**
   * Retrieves student data based on the unique student ID.
   *
   * @param {string} stud_unique_id - The unique identifier for the student.
   * @returns {Promise<Object>} A promise that resolves to an object containing student data, including:
   *   - student_id: The ID of the student.
   *   - preferred_name: The preferred name of the student.
   *   - last_name: The last name of the student.
   *   - email_address: The email address of the student.
   *   - wam_val: The WAM (Weighted Average Mark) value of the student.
   */
  return await promiseBasedQuery(
    "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val " +
      "FROM student stud WHERE stud_unique_id = ?",
    [stud_unique_id]
  );
}

async function getStudentUniqueId(student_id) {
  /**
   * Retrieves the unique ID of a student based on their student ID.
   *
   * @param {number} student_id - The ID of the student.
   * @returns {Promise<Object>} A promise that resolves to an object containing the student's unique ID.
   */
  return await promiseBasedQuery(
    "SELECT stud.stud_unique_id " + "FROM student stud WHERE student_id = ?",
    [student_id]
  );
}

async function transformParsedOutput(parsedOutput) {
  /**
   * Transforms the parsed output by mapping student IDs to unique IDs for each lab group.
   *
   * @param {Object} parsedOutput - The parsed output containing lab data.
   * @param {Object} parsedOutput.labId - The lab data for a specific lab.
   * @param {Array} parsedOutput.labId[].group - An array of groups within the lab.
   * @param {Array} parsedOutput.labId[].group[].student - An array of students within the group.
   * @param {Object} parsedOutput.labId[].group[].student[0] - The student object.
   * @param {string} parsedOutput.labId[].group[].student[0].student_id - The student ID.
   * @returns {Promise<Object>} A promise that resolves to an object containing lab IDs mapped to groups of student unique IDs.
   */
  const labStudents = {};

  for (const labId in parsedOutput) {
    const labData = parsedOutput[labId];
    // Process each group within the labData
    const groups = [];
    for (const group of labData) {
      const studentIdsInGroup = await Promise.all(
        group.map(async (student) => {
          const result = await getStudentUniqueId(
            parseInt(student[0].student_id)
          );
          return result[0].stud_unique_id;
        })
      );
      groups.push(studentIdsInGroup);
    }

    labStudents[labId] = groups;
  }
  return labStudents;
}

async function uploadCustomScript(req, res) {
  /**
   * Handles the upload of a custom script for generating student groups.
   *
   * @async
   * @function uploadCustomScript
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit.
   * @param {string} req.params.period - The period of the unit.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.scriptContent - The content of the custom script.
   * @param {number} [req.body.groupSize=5] - The desired group size (default is 5).
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if script content is missing or if there is an error during script execution.
   */
  const { unitCode, year, period } = req.params;
  const studentsInUnit = await getUnitStudentData(unitCode, year, period);

  const unit_off_id = await getUnitOffId(unitCode);
  const unit_off_lab_ids = await getLabsInUnit(unit_off_id[0].unit_off_id);
  const labGroups = {};

  for (const unit_off_lab_id of unit_off_lab_ids) {
    // Get students assigned to current lab
    const unit_off_lab_id_data = unit_off_lab_id.unit_off_lab_id;
    const labStudents = await getStudedntsInLab(unit_off_lab_id_data);

    if (!labGroups[unit_off_lab_id_data]) {
      labGroups[unit_off_lab_id_data] = [];
    }

    labGroups[unit_off_lab_id_data].push(labStudents);
  }

  const groupSize = req.body.groupSize || 5; // assuming a default group size of 5 if not provided

  try {
    const { scriptContent } = req.body;
    if (!scriptContent) throw new Error("Script content is missing.");

    // Modified pythonArgs to include the studentLabAllocations and groupSize
    //const pythonArgs = [ JSON.stringify(students), JSON.stringify(studentLabAllocations), groupSize.toString() ];

    // Set up the output for the groups
    var parsedOutput = {};

    // Run the Python script for each lab group
    for (const labId in labGroups) {
      const labStudents = labGroups[labId][0];
      const labStudentsData = [];

      // Get full student data
      for (let i = 0; i < labStudents.length; i++) {
        const stud_unique_id = labStudents[i].stud_unique_id;
        const labStudentData = await getStudentData(stud_unique_id);
        labStudentsData.push(labStudentData);
      }

      // Modify the pythonArgs to include only the labStudents for the current lab
      const labPythonArgs = [
        unitCode,
        year,
        period,
        JSON.stringify(labStudentsData),
      ];
      const pythonProcess = spawn("python", [
        "-c",
        scriptContent,
        ...labPythonArgs,
      ]);

      let output = "";
      await new Promise((resolve, reject) => {
        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
        });
        pythonProcess.stderr.on("error", (data) => {
          reject(new Error("Error in script execution. " + data.toString()));
        });
        pythonProcess.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Python script exited with code: ${code}`));
        });
      });

      parsedOutput[labId] = JSON.parse(output);
    }

    await storeGroupsInDatabase(unitCode, year, period, parsedOutput);
    res.json({ message: "Groups generated and stored successfully." });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({
      error: error.message || "An error occurred while processing the request.",
    });
  }
}

module.exports = { uploadCustomScript };
