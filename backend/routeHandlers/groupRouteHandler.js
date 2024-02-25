/**
 * This module should only contain functions that handle routes related
 * to groups and group data
 *
 * */

const db_connection = require("../config/databaseConfig");
const { promiseBasedQuery } = require("../helpers/commonHelpers");
const { groupFormationStrategies } = require("../helpers/groupFormationHelpers");

// get all groups from a unit
const getAllGroups = async (req, res) => {
    const { unitCode, year, period } = req.params;

    /* GET ALL GROUPS */
    const studentData = await promiseBasedQuery(
        "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, group_number, lab_number " +
        "FROM student stud " +
        "   INNER JOIN unit_enrolment ue ON ue.stud_unique_id=stud.stud_unique_id " +
        "   INNER JOIN unit_offering unit ON ue.unit_off_id=unit.unit_off_id " +
        "LEFT JOIN (SELECT s1.student_id as student_id, lab_number, group_number from " +
        "(SELECT s.student_id as student_id, lab_number " +
        "FROM student s    " +
        "INNER JOIN unit_enrolment ue ON ue.stud_unique_id = s.stud_unique_id " +
        "INNER JOIN unit_offering uo ON uo.unit_off_id = ue.unit_off_id " +
        "INNER JOIN student_lab_allocation sla ON sla.stud_unique_id = s.stud_unique_id    " +
        "INNER JOIN unit_off_lab uol ON uol.unit_off_lab_id = sla.unit_off_lab_id " +
        "WHERE uo.unit_code=? AND uo.unit_off_year=? AND uo.unit_off_period=?) s1 left JOIN    " +
        "(SELECT stud.student_id as student_id, group_number " +
        "FROM student stud " +
        "INNER JOIN group_allocation ga ON stud.stud_unique_id = ga.stud_unique_id " +
        "INNER JOIN lab_group lg ON ga.lab_group_id = lg.lab_group_id " +
        "INNER JOIN unit_off_lab uol ON uol.unit_off_lab_id = lg.unit_off_lab_id " +
        "INNER JOIN unit_offering uo ON uo.unit_off_id = uol.unit_off_id " +
        "WHERE uo.unit_code=? AND uo.unit_off_year=? AND uo.unit_off_period=?) s2 ON s1.student_id = s2.student_id)    " +
        "grp ON stud.student_id = grp.student_id " +
        "WHERE unit.unit_code=? " +
        "AND unit.unit_off_year=? " +
        "AND unit.unit_off_period=? order by group_number; ",
        [unitCode, year, period, unitCode, year, period, unitCode, year, period]
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
        const { student_id, preferred_name, last_name, email_address, wam_val, group_number, lab_number } = studentData[i];

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
        if (i + 1 === studentData.length || studentData[i + 1].group_number !== studentData[i].group_number) {
            responseData.push(group);
        }
    }

    res.status(200).send(responseData);
};

const getLabNumber = async (req, res) => {
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

// create all the groups (based on csv)
const createUnitGroups = async (req, res) => {
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
        // check the database to make sure EVERY student has an associated test result for the SELECTed strategy
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

    try {
        const connection = await db_connection.promise().getConnection();

        try {
            await connection.beginTransaction();

            /* DELETE ALL PREVIOUS GROUP ALLOCATIONS */
            await connection.execute(
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
            await connection.execute(
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

            await connection.commit();
            await connection.release();
        } catch (error) {
            console.log(error);
            await connection.rollback();
            await connection.release();
        }
    } catch (error) {
        console.log(error);
    }

    /* NOW FINALLY, FORM THE GROUPS */
    await groupFormationStrategies[strategy](unitCode, year, period, groupSize, variance);
    res.status(200).send();
};

// re-create (i.e. shuffle) unit groups
const shuffleUnitGroups = async (req, res) => {
    const { unitCode, year, period } = req.params;

    /* RE-CREATE THE UNIT GROUPS */
    await createUnitGroups(req, res);
};

// move a student from one group to another
const moveStudent = async (req, res) => {
    const { unitCode, year, period, studentId, hasAGroup } = req.params;
    const { newGroup } = req.body;

    /* OBTAIN ALLOCATION AND ASSIGNMENT DATA REQUIRED FOR UPDATES */
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
        "SELECT g_alloc, group_id, s.stud_unique_id, uol.unit_off_lab_id " +
        "FROM (SELECT s.stud_unique_id as student_id, ga.group_alloc_id as g_alloc, lg.lab_group_id as group_id " +
        "FROM student s " +
        "INNER JOIN group_allocation ga ON s.stud_unique_id = ga.stud_unique_id " +
        "INNER JOIN lab_group lg ON lg.lab_group_id = ga.lab_group_id " +
        "WHERE s.student_id=?) grp " +
        "RIGHT JOIN student s ON grp.student_id = s.stud_unique_id " +
        "INNER JOIN student_lab_allocation sla ON sla.stud_unique_id = s.stud_unique_id " +
        "INNER JOIN unit_off_lab uol ON uol.unit_off_lab_id = sla.unit_off_lab_id " +
        "INNER JOIN unit_enrolment ue ON s.stud_unique_id = ue.stud_unique_id " +
        "INNER JOIN unit_offering u ON u.unit_off_id = ue.unit_off_id " +
        "WHERE s.student_id=? " +
        "AND u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=?;",
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
        await promiseBasedQuery("UPDATE group_allocation " + "     SET lab_group_id=? " + "     WHERE group_alloc_id=?;", [
            newGroupData["lab_group_id"],
            currentGroupData["g_alloc"],
        ]);
    } else {
        await promiseBasedQuery("insert into group_allocation " + "(stud_unique_id, lab_group_id) " + "values ( ?, ? );", [
            currentGroupData["stud_unique_id"],
            newGroupData["lab_group_id"],
        ]);
    }

    // change the student's lab if it is a new one we are moving to
    if (newGroupData["unit_off_lab_id"] !== currentGroupData["unit_off_lab_id"]) {
        await promiseBasedQuery(
            "UPDATE student_lab_allocation " +
                "SET unit_off_lab_id=? " +
                "WHERE stud_unique_id=? " +
                "AND unit_off_lab_id=?;",
            [newGroupData["unit_off_lab_id"], currentGroupData["stud_unique_id"], currentGroupData["unit_off_lab_id"]]
        );
    }

    res.status(200).send({ wip: "test" });
};

module.exports = {
    getAllGroups,
    getLabNumber,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
};
