/**
 * This module should only contain functions that handle routes related
 * to units and unit data
 *
 * */

const { promiseBasedQuery } = require("../helpers/commonHelpers");

const getAllUnits = async (req, res) => {
    /**
     * Gets all units registered under a user
     */
    try {
        const units = await promiseBasedQuery("SELECT * FROM unit_offering;");
        res.status(200).json(units);
    } catch (e) {
        console.log(e);
    }
};

const addUnit = async (req, res) => {
    /**
     * Adds a new unit under a users account
     */
    const {
        unitCode,
        unitName,
        year,
        period,
        color
    } = req.body;

    try {
        // note: unique id has auto_increment enabled thus not provided
        await promiseBasedQuery(
            "INSERT INTO unit_offering " +
            "(unit_code, unit_name, unit_off_year, unit_off_period, enrolment_count, unit_color) " +
            "VALUES (?, ?, ?, ?, ?, ?);",
            [unitCode, unitName, Number(year), period, 0, color]
        );

        res.status(200).send();
    } catch (error) {
        console.log(error.code);
        let errorMsg;
        switch (error.code) {
            case "ER_DUP_ENTRY":
                errorMsg = `the unit offering ${unitCode}, ${year}, ${period} already exists`;
                break;
            case "ER_BAD_FIELD_ERROR":
                errorMsg = `year ${year} is not a number`;
                break;
            default:
                errorMsg = "something went wrong :(";
        }
        res.status(400).send(errorMsg);
    }
};

const deleteUnit = async function (req, res) {
    /**
     * Deletes a unit registered under a user by going through related foreign key constraints
     * and removing associated rows in the order:
     * group allocs -> groups -> lab allocs -> labs -> enrolments -> test results -> test attempts -> unit
     *
     * TODO temporarily reverted from db transactions to sequence of queries
     */
    const {
        unitCode,
        year,
        period,
    } = req.params;

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
    * Checks to see which group formation strategy can be used by the user
    * to form groups, based on what student data has been uploaded to the DB
    *
    */

    const { unitCode, year, period } = req.params;

    /* FIXME: works when we have only one or the other type but not both
    * */
    const [strategyAvailability] = await promiseBasedQuery(
        "SELECT " +
        "    COUNT(ue.enrolment_id) = COUNT(b.personality_test_attempt) AS belbin, " +
        "    COUNT(ue.enrolment_id) = COUNT(e.personality_test_attempt) AS effort " +
        "FROM unit_offering u " +
        "    INNER JOIN unit_enrolment ue ON ue.unit_off_id=u.unit_off_id " +
        "    LEFT JOIN personality_test_attempt ta ON ta.unit_off_id = u.unit_off_id " +
        "    LEFT JOIN belbin_result b ON b.personality_test_attempt = ta.test_attempt_id " +
        "    LEFT JOIN effort_result e ON e.personality_test_attempt = ta.test_attempt_id " +
        "WHERE u.unit_code=? " +
        "    AND u.unit_off_year=? " +
        "    AND u.unit_off_period=?;",
        [unitCode, year, period]
    )

    console.log(strategyAvailability);

    res.status(200).json(strategyAvailability);
}

module.exports = {
    getAllUnits,
    addUnit,
    deleteUnit,
    verifyAvailableGroupFormationStrats
};
