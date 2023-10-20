const { spawn } = require("child_process");

const { promiseBasedQuery, selectUnitOffKey } = require("../helpers/commonHelpers");

async function storeGroupsInDatabase(unitCode, year, period, parsedOutput) {
  const unitOffIdResult = await promiseBasedQuery(
    "SELECT unit_off_id FROM unit_offering WHERE unit_code = ? AND unit_off_year = ? AND unit_off_period = ?",
    [unitCode, year, period]
  );

  if (!unitOffIdResult.length) throw new Error("Invalid unit code, year, or period provided.");

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

  //console.log('LAB STUDENTS: ', labStudents);

  const groupInsertData = [];
  let numGroups = 0;
  for (let labId in labStudents) {
    //console.log('LAB ID:', labId);

    /* INSERT THE NEW GROUPS INTO THE DATABASE */
    // determine the number of groups to be inserted to database -> inserted as [unit_off_lab_id, group_number]
    labStudents[labId].forEach((student) => {
      numGroups++;
      groupInsertData.push([labId, numGroups]);
    });

    await promiseBasedQuery("INSERT IGNORE INTO lab_group (unit_off_lab_id, group_number) VALUES ?;", [
      groupInsertData,
    ]);

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

    // console.log("GROUP DATA: ", groupData);
    // for each group, pop a group from the lab key in object and form the allocation
    for (let i = 0; i < numGroups; i++) {
      const group = groupData.pop();
      // console.log("GROUP: ", group);
      const groupStudents = labStudents[group.unit_off_lab_id].pop();
      // console.log("GROUP STUDENTS: ", groupStudents);
      if (groupStudents === undefined) {
        break;
      } else {
        groupStudents.forEach((studentId) => {
          groupAllocInsertData.push([studentId, group.lab_group_id]);
        });
      }
    }

    // student allocations are created as [~~group_alloc_id~~, stud_unique_id, lab_group_id]
    await promiseBasedQuery("INSERT IGNORE INTO group_allocation (stud_unique_id, lab_group_id) VALUES ?;", [
      groupAllocInsertData,
    ]);
  }
}

async function getUnitStudentData(unitCode, year, period) {
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
  return await promiseBasedQuery("SELECT unit_off_lab_id FROM unit_off_lab WHERE unit_off_id = ?", [unit_off_id]);
}

async function getUnitOffId(unit_code) {
  return await promiseBasedQuery("SELECT unit_off_id FROM unit_offering WHERE unit_code = ?", [unit_code]);
}

async function getStudedntsInLab(unit_off_lab_id) {
  //const studentIds = students.map((s) => s.stud_unique_id);
  return await promiseBasedQuery("SELECT stud_unique_id FROM student_lab_allocation WHERE unit_off_lab_id = ?", [
    unit_off_lab_id,
  ]);
}

async function getStudentData(stud_unique_id) {
  return await promiseBasedQuery(
    "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val " +
      "FROM student stud WHERE stud_unique_id = ?",
    [stud_unique_id]
  );
}

async function getStudentUniqueId(student_id) {
  return await promiseBasedQuery("SELECT stud.stud_unique_id " + "FROM student stud WHERE student_id = ?", [
    student_id,
  ]);
}

async function transformParsedOutput(parsedOutput) {
  const labStudents = {};

  for (const labId in parsedOutput) {
    const labData = parsedOutput[labId];

    // Process each group within the labData
    const groups = [];
    for (const group of labData) {
      const studentIdsInGroup = await Promise.all(
        group.map(async (student) => {
          //console.log('STUDENT ID: ', parseInt(student[0].student_id));
          const result = await getStudentUniqueId(parseInt(student[0].student_id));
          return result[0].stud_unique_id;
        })
      );
      groups.push(studentIdsInGroup);
    }

    labStudents[labId] = groups;
  }
  // console.log("RETURN: ", labStudents);
  return labStudents;
}

async function uploadCustomScript(req, res) {
  const { unitCode, year, period } = req.params;
  const studentsInUnit = await getUnitStudentData(unitCode, year, period);
  //console.log('STUDENTS IN unit:', studentsInUnit);

  const unit_off_id = await getUnitOffId(unitCode);
  const unit_off_lab_ids = await getLabsInUnit(unit_off_id[0].unit_off_id);
  //console.log('UNIT OFF LAB IDS: ', unit_off_lab_ids);
  const labGroups = {};

  for (const unit_off_lab_id of unit_off_lab_ids) {
    // Get students assigned to current lab
    const unit_off_lab_id_data = unit_off_lab_id.unit_off_lab_id;
    const labStudents = await getStudedntsInLab(unit_off_lab_id_data);
    //console.log('LAB STUDENTS: ', labStudents);
    //console.log('UNIT OFF LAB ID: ', unit_off_lab_id.unit_off_lab_id);
    //const labStudents = studentInUnit.filter((student) => student.stud_unique_id === labAllocation.stud_unique_id);

    if (!labGroups[unit_off_lab_id_data]) {
      labGroups[unit_off_lab_id_data] = [];
    }

    labGroups[unit_off_lab_id_data].push(labStudents);
  }

  const groupSize = req.body.groupSize || 5; // assuming a default group size of 5 if not provided
  //console.log('LAB GROUPS:', labGroups);

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

      //console.log('LAB STUDENTS DATA: ', labStudentsData);
      // Modify the pythonArgs to include only the labStudents for the current lab
      const labPythonArgs = [unitCode, year, period, JSON.stringify(labStudentsData)];

      //console.log(labPythonArgsJSON);
      const pythonProcess = spawn("python", ["-c", scriptContent, ...labPythonArgs]);

      let output = "";
      await new Promise((resolve, reject) => {
        pythonProcess.stdout.on("data", (data) => {
          //console.log('DATA: ', data);
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

    // console.log("PARSED OUTPUT: ", parsedOutput);
    await storeGroupsInDatabase(unitCode, year, period, parsedOutput);
    res.json({ message: "Groups generated and stored successfully." });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: error.message || "An error occurred while processing the request." });
  }
}

module.exports = { uploadCustomScript };
