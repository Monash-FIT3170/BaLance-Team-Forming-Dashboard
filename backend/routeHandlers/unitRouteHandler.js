/**
 * This module should only contain functions that handle routes related
 * to units and unit data
 *
 */

const { promiseBasedQuery } = require("../helpers/commonHelpers");

const getAllUnits = async (req, res) => {
  /**
   * Asynchronous function to get all units registered under a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.user - The user object attached to the request.
   * @param {string} req.user.email - The email of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves to void.
   *
   * @throws {Error} - Throws an error if the database query fails.
   */
  const email = req.user.email;
  try {
    const [staff] = await promiseBasedQuery(
      "SELECT staff_unique_id FROM staff WHERE email_address = ?;",
      [email]
    );

    if (!staff) {
      return res.status(404).send("Staff not found");
    }
    staff_id = staff.staff_unique_id;
    const units = await promiseBasedQuery(
      "SELECT * FROM unit_offering where staff_unique_id=?",
      [staff_id]
    );
    res.status(200).json(units);
  } catch (e) {
    console.log(e);
  }
};

const addUnit = async (req, res) => {
  /**
   * Adds a new unit offering to the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.unitCode - The code of the unit.
   * @param {string} req.body.unitName - The name of the unit.
   * @param {string} req.body.year - The year of the unit offering.
   * @param {string} req.body.period - The period of the unit offering.
   * @param {string} req.body.color - The color associated with the unit.
   * @param {Object} req.user - The user object from the decoded token.
   * @param {string} req.user.email - The email of the user.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves when the unit offering is added.
   *
   * @throws {Error} - Throws an error if the unit offering already exists or if there is a database error.
   */
  const { unitCode, unitName, year, period, color } = req.body;

  const email = req.user.email; // Assuming email is available from the decoded token

  try {
    // First, retrieve staff_id from the staff table
    const [staff] = await promiseBasedQuery(
      "SELECT staff_unique_id FROM staff WHERE email_address = ?;",
      [email]
    );

    if (!staff) {
      return res.status(404).send("Staff not found");
    }
    staff_id = staff.staff_unique_id;
    
    // Now, insert the unit offering
    await promiseBasedQuery(
      "INSERT INTO unit_offering " +
        "(unit_code, unit_name, unit_off_year, unit_off_period, staff_unique_id, enrolment_count, unit_color) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?);",
      [unitCode, unitName, Number(year), period, staff_id, 0, color]
    );

    res.status(200).send();
  } catch (error) {
    console.log(error.code);
    let errorMsg;
    switch (error.code) {
      case "ER_DUP_ENTRY":
        errorMsg = `The unit offering ${unitCode}, ${year}, ${period} already exists`;
        break;
      case "ER_BAD_FIELD_ERROR":
        errorMsg = `Year ${year} is not a number`;
        break;
      default:
        errorMsg = "Something went wrong :(";
    }
    res.status(400).send(errorMsg);
  }
};

const deleteUnit = async function (req, res) {
  /**
   * Deletes a unit registered under a user by going through related foreign key constraints
   * and removing associated rows in the order:
   * group allocations -> groups -> lab allocations -> labs -> enrolments -> test results -> test attempts -> unit.
   *
   * @async
   * @function deleteUnit
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The code of the unit to be deleted.
   * @param {number} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - Sends a 200 status response upon successful deletion.
   */
  const { unitCode, year, period } = req.params;

  // group allocations
  await promiseBasedQuery(
    "DELETE FROM group_allocation " +
      "WHERE group_alloc_id IN ( " +
      "    SELECT subquery.group_alloc_id " +
      "    FROM ( " +
      "        SELECT ga.group_alloc_id " +
      "        FROM lab_group g " +
      "            INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id " +
      "            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "            INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id " +
      "        WHERE u.unit_code=? " +
      "            AND u.unit_off_year=? " +
      "            AND u.unit_off_period=? " +
      "    ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // groups
  await promiseBasedQuery(
    "DELETE FROM lab_group " +
      "WHERE lab_group_id IN ( " +
      "    SELECT subquery.lab_group_id " +
      "    FROM ( " +
      "        SELECT g.lab_group_id " +
      "        FROM lab_group g " +
      "            INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id " +
      "            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "        WHERE u.unit_code=? " +
      "            AND u.unit_off_year=? " +
      "            AND u.unit_off_period=? " +
      "    ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // lab allocations
  await promiseBasedQuery(
    "DELETE FROM student_lab_allocation " +
      "WHERE stud_lab_alloc_id IN ( " +
      "    SELECT subquery.stud_lab_alloc_id " +
      "    FROM ( " +
      "        SELECT la.stud_lab_alloc_id " +
      "        FROM student_lab_allocation la " +
      "            INNER JOIN unit_off_lab l ON la.unit_off_lab_id = l.unit_off_lab_id " +
      "            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "        WHERE u.unit_code=? " +
      "            AND u.unit_off_year=? " +
      "            AND u.unit_off_period=? " +
      "    ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // labs
  await promiseBasedQuery(
    "DELETE FROM unit_off_lab " +
      "WHERE unit_off_lab_id IN ( " +
      "   SELECT subquery.unit_off_lab_id " +
      "   FROM ( " +
      "       SELECT l.unit_off_lab_id " +
      "       FROM unit_off_lab l " +
      "           INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
      "       WHERE u.unit_code=? " +
      "           AND u.unit_off_year=? " +
      "           AND u.unit_off_period=? " +
      "   ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // enrolments
  await promiseBasedQuery(
    "DELETE FROM unit_enrolment " +
      "WHERE enrolment_id IN ( " +
      "  SELECT subquery.enrolment_id " +
      "  FROM ( " +
      "    SELECT ue.enrolment_id " +
      "    FROM unit_enrolment ue " +
      "    INNER JOIN unit_offering u ON ue.unit_off_id = u.unit_off_id " +
      "    WHERE " +
      "      u.unit_code=? " +
      "      AND u.unit_off_year=? " +
      "      AND u.unit_off_period=? " +
      "  ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // test results: belbin & effort
  await promiseBasedQuery(
    "DELETE FROM belbin_result " +
      "WHERE belbin_result_id IN ( " +
      "   SELECT subquery.belbin_result_id " +
      "   FROM ( " +
      "       SELECT b.belbin_result_id " +
      "       FROM belbin_result b " +
      "           INNER JOIN personality_test_attempt pt ON pt.test_attempt_id = b.personality_test_attempt " +
      "           INNER JOIN unit_offering u ON u.unit_off_id = pt.unit_off_id " +
      "       WHERE u.unit_code=? " +
      "           AND u.unit_off_year=? " +
      "           AND u.unit_off_period=? " +
      "   ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  await promiseBasedQuery(
    "DELETE FROM effort_result " +
      "WHERE effort_result_id IN ( " +
      "   SELECT subquery.effort_result_id " +
      "   FROM ( " +
      "       SELECT e.effort_result_id " +
      "       FROM effort_result e " +
      "           INNER JOIN personality_test_attempt pt ON pt.test_attempt_id = e.personality_test_attempt " +
      "           INNER JOIN unit_offering u ON u.unit_off_id = pt.unit_off_id " +
      "       WHERE u.unit_code=? " +
      "           AND u.unit_off_year=? " +
      "           AND u.unit_off_period=? " +
      "   ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // test attempts
  await promiseBasedQuery(
    "DELETE FROM personality_test_attempt " +
      "WHERE test_attempt_id IN ( " +
      "   SELECT subquery.test_attempt_id " +
      "   FROM ( " +
      "       SELECT pt.test_attempt_id " +
      "       FROM personality_test_attempt pt " +
      "           INNER JOIN unit_offering u ON u.unit_off_id = pt.unit_off_id " +
      "       WHERE u.unit_code=? " +
      "           AND u.unit_off_year=? " +
      "           AND u.unit_off_period=? " +
      "   ) AS subquery " +
      ");",
    [unitCode, year, period]
  );

  // unit
  await promiseBasedQuery(
    "DELETE FROM unit_offering u " +
      "WHERE u.unit_code=? " +
      "   AND u.unit_off_year=? " +
      "   AND u.unit_off_period=?;",
    [unitCode, year, period]
  );

  res.status(200).send();
};

const verifyAvailableGroupFormationStrats = async (req, res) => {
  /**
   * Asynchronously verifies which group formation strategies are available for a given unit offering.
   *
   * This function checks the database to determine which group formation strategies (effort, belbin, times)
   * can be used by the user to form groups based on the student data that has been uploaded.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The unit code.
   * @param {string} req.params.year - The year of the unit offering.
   * @param {string} req.params.period - The period of the unit offering.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves to void.
   */
  const { unitCode, year, period } = req.params;

  const [strategyAvailability] = await promiseBasedQuery(
    "SELECT " +
      "    COUNT(CASE WHEN ta.test_type = 'effort' THEN 1 END) = COUNT(DISTINCT s.stud_unique_id) AS effort, " +
      "    COUNT(CASE WHEN ta.test_type = 'belbin' THEN 1 END) = COUNT(DISTINCT s.stud_unique_id) AS belbin, " +
      "    COUNT(CASE WHEN ta.test_type = 'times' THEN 1 END) = COUNT(DISTINCT s.stud_unique_id) AS times " +
      "FROM unit_offering u " +
      "    INNER JOIN personality_test_attempt ta ON ta.unit_off_id = u.unit_off_id " +
      "    INNER JOIN unit_enrolment ue ON ue.unit_off_id=u.unit_off_id " +
      "    INNER JOIN student s ON s.stud_unique_id=ue.stud_unique_id " +
      "WHERE u.unit_code=? " +
      "    AND u.unit_off_year=? " +
      "    AND u.unit_off_period=? " +
      "    AND ta.stud_unique_id=s.stud_unique_id " +
      "GROUP BY u.unit_off_id;",
    [unitCode, year, period]
  );

  res.status(200).json(strategyAvailability);
};

module.exports = {
  getAllUnits,
  addUnit,
  deleteUnit,
  verifyAvailableGroupFormationStrats,
};
