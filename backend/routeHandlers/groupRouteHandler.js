const { promiseBasedQuery } = require("../helpers/commonHelpers");
const {
  groupFormationStrategies,
} = require("../helpers/groupFormationHelpers");

const getAllGroups = async (req, res) => {
  /**
   * Retrieves all students grouped by their group allocations and includes lab numbers.
   *
   * @async
   * @function getAllGroups
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Sends a response with the grouped student data.
   */
  /**
   * Obtains all students grouped by their group allocations and including lab numbers
   */
  const { unitCode, year, period } = req.params;

  /* GET ALL GROUPS */
  const studentData = await promiseBasedQuery(
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

  const responseData = [];
  let group = { students: [] };
  for (let i = 0; i < studentData.length; i++) {
    // check if this is a new group we are handling
    if (studentData[i].group_number === null) {
      continue;
    }
    if (group["group_number"] !== studentData[i].group_number) {
      group = {
        group_number: studentData[i].group_number,
        lab_number: studentData[i].lab_number,
        students: [],
      };
    }

    // add student to the groups list of students
    const {
      student_id,
      preferred_name,
      last_name,
      email_address,
      wam_val,
      group_number,
      lab_number,
    } = studentData[i];

    group.students.push({
      student_id: student_id,
      preferred_name: preferred_name,
      last_name: last_name,
      email_address: email_address,
      wam_val: wam_val,
      group_number: group_number,
      lab_number: lab_number,
    });

    // if the next student is in a new group or this is the last student, push this group
    if (
      i + 1 === studentData.length ||
      studentData[i + 1].group_number !== studentData[i].group_number
    ) {
      responseData.push(group);
    }
  }

  res.status(200).send(responseData);
};

const getLabNumber = async (req, res) => {
  /**
   * Retrieves the lab number for a specific group based on the provided unit code, year, period, and group number.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {number} req.params.groupNumber - The group number.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Sends the lab number as a response.
   */
  const { unitCode, year, period, groupNumber } = req.params;
  const lab_number = await promiseBasedQuery(
    "SELECT lab_number from unit_off_lab lab " +
      "JOIN lab_group team ON lab.unit_off_lab_id = team.unit_off_lab_id " +
      "JOIN unit_offering unit ON lab.unit_off_id = unit.unit_off_id " +
      "where " +
      "     unit.unit_code = ?" +
      "     and unit.unit_off_year = ?" +
      "     and unit.unit_off_period = ?" +
      "     and team.group_number = ?;",
    [unitCode, year, period, groupNumber]
  );
  res.status(200).send(lab_number);
};

const createUnitGroups = async (req, res) => {
  /**
   * Creates unit groups based on the specified parameters and strategy.
   *
   * This function validates the selected group formation strategy, deletes any existing groups,
   * and then forms new groups according to the specified strategy.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} req.body - The request body.
   * @param {number} [req.body.groupSize=4] - The desired group size.
   * @param {number} [req.body.variance=1] - The allowed variance in group size.
   * @param {string} [req.body.strategy="random"] - The group formation strategy.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves when the groups have been created.
   *
   * @throws {Error} - Throws an error if the strategy is not valid or if there is an issue with the database queries.
   */
  const { unitCode, year, period } = req.params;
  let { groupSize, variance, strategy } = req.body;

  if (!groupSize) {
    groupSize = 4;
  }
  if (!variance) {
    variance = 1;
  }
  if (!strategy) {
    strategy = "random";
  }

  /* CHECK IF THE USER IS ALLOWED TO FORM GROUPS WITH THE SELECTED STRATEGY */
  if (strategy !== "random") {
    // check the database to make sure EVERY student has an associated test result for the selected strategy
    const [{ missingValues }] = await promiseBasedQuery(
      "SELECT (count(*) > 0) AS `missingValues` " +
        "FROM student s " +
        "    INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id " +
        "    INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id " +
        "WHERE " +
        "    u.unit_code=? " +
        "    AND u.unit_off_year=? " +
        "    AND u.unit_off_period=? " +
        "    AND s.stud_unique_id NOT IN ( " +
        "        SELECT s.stud_unique_id " +
        "        FROM student s " +
        "            INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id " +
        "            INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id " +
        "            INNER JOIN personality_test_attempt t ON t.stud_unique_id=s.stud_unique_id " +
        "        WHERE " +
        "            u.unit_code=? " +
        "            AND u.unit_off_year=? " +
        "            AND u.unit_off_period=? " +
        "            AND t.test_type=? " +
        "    );",
      [unitCode, year, period, unitCode, year, period, strategy]
    );

    if (missingValues) {
      res.status(400).json({
        Error: `student data does not exist for ${strategy} strategy. Please upload ${strategy} data first.`,
      });
      return;
    }
  }

  /* DELETE ALL PREVIOUS GROUP ALLOCATIONS */
  await promiseBasedQuery(
    "DELETE FROM group_allocation " +
      "WHERE group_alloc_id IN (" +
      "    SELECT subquery.group_alloc_id " +
      "    FROM (" +
      "        SELECT ga.group_alloc_id " +
      "        FROM lab_group g " +
      "            INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id " +
      "            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "            INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id " +
      "        WHERE u.unit_code = ? " +
      "            AND u.unit_off_year = ? " +
      "            AND u.unit_off_period = ? " +
      "    ) AS subquery" +
      ");",
    [unitCode, year, period]
  );

  /* DELETE ALL PREVIOUS GROUPS THEMSELVES */
  await promiseBasedQuery(
    "DELETE FROM lab_group " +
      "WHERE lab_group_id IN ( " +
      "    SELECT subquery.lab_group_id " +
      "    FROM ( " +
      "        SELECT g.lab_group_id " +
      "        FROM lab_group g " +
      "        INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id " +
      "        INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "        WHERE " +
      "            u.unit_code = ? " +
      "            AND u.unit_off_year = ? " +
      "            AND u.unit_off_period = ? " +
      "    ) AS subquery" +
      ");",
    [unitCode, year, period]
  );

  /* NOW FINALLY, FORM THE GROUPS */
  await groupFormationStrategies[strategy](
    unitCode,
    year,
    period,
    groupSize,
    variance
  );
  res.status(200).send();
};

const shuffleUnitGroups = async (req, res) => {
  /**
   * Used to shuffle i.e. re-create groups given they already exist. fixme redundancy
   */

  await createUnitGroups(req, res);
};

const moveStudent = async (req, res) => {
  /**
   * Moves a student from one group to another and updates the lab allocation if necessary.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code.
   * @param {string} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {string} req.params.studentId - The ID of the student.
   * @param {string} req.params.hasAGroup - Indicates if the student is already in a group.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.newGroup - The new group number to move the student to.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const { unitCode, year, period, studentId, hasAGroup } = req.params;
  const { newGroup } = req.body;

  /* OBTAIN LAB ALLOCATION AND GROUP ASSIGNMENT DATA REQUIRED FOR UPDATES */
  // get the id of the new group we are changing to as well as the id of the lab it is in
  const [newGroupData] = await promiseBasedQuery(
    "SELECT g.lab_group_id, l.unit_off_lab_id " +
      "FROM lab_group g " +
      "     INNER JOIN unit_off_lab l ON l.unit_off_lab_id = g.unit_off_lab_id " +
      "     INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "LEFT JOIN group_allocation ga ON g.lab_group_id = ga.lab_group_id " +
      "WHERE g.group_number=? " +
      "     AND u.unit_code=? " +
      "     AND u.unit_off_year=? " +
      "     AND u.unit_off_period=?;",
    [newGroup, unitCode, year, period]
  );

  const [currentGroupData] = await promiseBasedQuery(
    "SELECT g_alloc, group_id, s.stud_unique_id, uol.unit_off_lab_id FROM (" +
      "   SELECT s.stud_unique_id as student_id, ga.group_alloc_id as g_alloc, lg.lab_group_id as group_id " +
      "   FROM student s " +
      "   INNER JOIN group_allocation ga ON s.stud_unique_id = ga.stud_unique_id " +
      "   INNER JOIN lab_group lg ON lg.lab_group_id = ga.lab_group_id " +
      "   WHERE s.student_id=?" +
      ") grp " +
      "   RIGHT JOIN student s ON grp.student_id = s.stud_unique_id " +
      "   INNER JOIN student_lab_allocation sla ON sla.stud_unique_id = s.stud_unique_id " +
      "   INNER JOIN unit_off_lab uol ON uol.unit_off_lab_id = sla.unit_off_lab_id " +
      "   INNER JOIN unit_enrolment ue ON s.stud_unique_id = ue.stud_unique_id " +
      "   INNER JOIN unit_offering u ON u.unit_off_id = ue.unit_off_id " +
      "WHERE s.student_id=? " +
      "   AND u.unit_code=? " +
      "   AND u.unit_off_year=? " +
      "   AND u.unit_off_period=?;",
    [studentId, studentId, unitCode, year, period]
  );

  // get the id of the current group allocation and the id of the lab it is in

  /* UPDATE NEW GROUP ASSIGNMENT AND UPDATE LAB ALLOC IF NEEDED */
  // change the group id of the current group allocation to the new group id
  // fixme if id is not new, ignore
  // console.log(`old lab id is ${currentGroupData["unit_off_lab_id"]} and new one is ${newGroupData["unit_off_lab_id"]}`)
  // console.log(`old lab group is ${currentGroupData["group_alloc_id"]} and new one is ${newGroupData["lab_group_id"]}`)
  // fixme, confirm that the student in the group we are updating, is

  if (hasAGroup === "true") {
    await promiseBasedQuery(
      "UPDATE group_allocation " +
        "     SET lab_group_id=? " +
        "     WHERE group_alloc_id=?;",
      [newGroupData["lab_group_id"], currentGroupData["g_alloc"]]
    );
  } else {
    await promiseBasedQuery(
      "insert into group_allocation " +
        "(stud_unique_id, lab_group_id) " +
        "values ( ?, ? );",
      [currentGroupData["stud_unique_id"], newGroupData["lab_group_id"]]
    );
  }

  // change the student's lab if it is a new one we are moving to
  if (newGroupData["unit_off_lab_id"] !== currentGroupData["unit_off_lab_id"]) {
    await promiseBasedQuery(
      "UPDATE student_lab_allocation " +
        "SET unit_off_lab_id=? " +
        "WHERE stud_unique_id=? " +
        "AND unit_off_lab_id=?;",
      [
        newGroupData["unit_off_lab_id"],
        currentGroupData["stud_unique_id"],
        currentGroupData["unit_off_lab_id"],
      ]
    );
  }

  res.status(200).send();
};

module.exports = {
  getAllGroups,
  getLabNumber,
  createUnitGroups,
  shuffleUnitGroups,
  moveStudent,
};
