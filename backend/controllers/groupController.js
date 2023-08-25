/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */
const {
    promiseBasedQuery
} = require("../helpers/commonHelpers");

const {
    groupFormationStrategies,
} = require("../helpers/groupFormationHelpers")

// get all groups from a unit
const getAllGroups = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;

    /* GET ALL GROUPS */
    const studentData = await promiseBasedQuery(
        'SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, l_group.group_number, lab.lab_number ' +
        'FROM student stud ' +
        'INNER JOIN group_allocation g_alloc ON stud.stud_unique_id=g_alloc.stud_unique_id ' +
        'INNER JOIN lab_group l_group ON g_alloc.lab_group_id=l_group.lab_group_id ' +
        'INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_group.unit_off_lab_id ' +
        'INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id ' +
        'WHERE' +
        '   unit.unit_code=? ' +
        '   AND unit.unit_off_year=? ' +
        '   AND unit.unit_off_period=?' +
        'ORDER BY l_group.group_number;',
        [unitCode, year, period]
    );

    const responseData = [];
    let group = {students: []}
    for(let i=0; i<studentData.length; i++) {
        // check if this is a new group we are handling
        if (group['group_number'] !== studentData[i].group_number) {
            group = {group_number: studentData[i].group_number, lab_number: studentData[i].lab_number, students: []}
        }

        // add student to the groups list of students
        const {
            student_id,
            preferred_name,
            last_name,
            email_address,
            wam_val
        } = studentData[i];

        group.students.push({
            student_id: student_id,
            preferred_name: preferred_name,
            last_name: last_name,
            email_address: email_address,
            wam_val: wam_val
        })

        // if the next student is in a new group or this is the last student, push this group
        if(i+1 === studentData.length || studentData[i+1].group_number !== studentData[i].group_number) {
            responseData.push(group);
        }
    }

    res.status(200).send(responseData);
}

// get a single group from a unit
const getGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// create all the groups (based on csv)
const createUnitGroups = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;
    let {
        groupSize,
        variance,
        strategy,
    } = req.body;

    if (!groupSize) {
        groupSize=4;
    }
    if (!variance) {
        variance=1;
    }
    if (!strategy) {
        strategy='random';
    }

    await groupFormationStrategies[strategy](unitCode, year, period, groupSize, variance);
    res.status(200).send();
}

// re-create (i.e. shuffle) unit groups
const shuffleUnitGroups = async (req, res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;

    /* DELETE ALL GROUP ALLOCATIONS */
    await promiseBasedQuery(
        'DELETE FROM group_allocation ' +
        'WHERE group_alloc_id IN (' +
        '  SELECT subquery.group_alloc_id ' +
        '  FROM (' +
        '    SELECT ga.group_alloc_id ' +
        '    FROM lab_group g ' +
        '    INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id ' +
        '    INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id ' +
        '    INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id ' +
        '    WHERE u.unit_code = ? ' +
        '      AND u.unit_off_year = ? ' +
        '      AND u.unit_off_period = ? ' +
        '  ) AS subquery' +
        ');',
        [unitCode, year, period]
    );

    /* DELETE ALL GROUPS THEMSELVES */
    await promiseBasedQuery(
        'DELETE FROM lab_group ' +
        'WHERE lab_group_id IN ( ' +
        '  SELECT subquery.lab_group_id ' +
        '  FROM ( ' +
        '    SELECT g.lab_group_id ' +
        '    FROM lab_group g ' +
        '    INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id ' +
        '    INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id ' +
        '    WHERE ' +
        '      u.unit_code = ? ' +
        '      AND u.unit_off_year = ? ' +
        '      AND u.unit_off_period = ? ' +
        '  ) AS subquery' +
        ');',
        [unitCode, year, period]
    );

    /* RE-CREATE THE UNIT GROUPS */
    await createUnitGroups(req, res);
}

// add a new group to a unit
const addGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// move a student from one group to another
const moveStudent = async (req, res) => {
    /* REQUIRES OFFERING, STUDENT, OLD GROUP, NEW GROUP */
    const {
        unitCode,
        year,
        period,
        studentId
    } = req.params;
    const { newGroup } = req.body;

    console.log(unitCode, year, period, studentId, newGroup);

    /* OBTAIN ALLOCATION AND ASSIGNMENT DATA REQUIRED FOR UPDATES */
    // get the id of the new group we are changing to as well as the id of the lab it is in
    const [newGroupData] = await promiseBasedQuery(
        "SELECT g.lab_group_id, l.unit_off_lab_id " +
        "FROM lab_group g " +
        "   INNER JOIN unit_off_lab l ON l.unit_off_lab_id = g.unit_off_lab_id " +
        "   INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
        "WHERE g.group_number=? " +
        "   AND u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
        [newGroup, unitCode, year, period]
    )

    // get the id of the current group allocation and the id of the lab it is in
    const [currentGroupData] = await promiseBasedQuery(
        "SELECT ga.group_alloc_id, l.unit_off_lab_id, s.stud_unique_id " +
        "FROM group_allocation ga " +
        "   INNER JOIN student s ON ga.stud_unique_id = s.stud_unique_id " +
        "   INNER JOIN unit_enrolment ue ON s.stud_unique_id = ue.stud_unique_id " +
        "   INNER JOIN unit_offering u ON u.unit_off_id = ue.unit_off_id " +
        "   INNER JOIN lab_group lg ON lg.lab_group_id = ga.lab_group_id " +
        "   INNER JOIN unit_off_lab l ON l.unit_off_lab_id = lg.unit_off_lab_id " +
        "WHERE s.student_id=? " +
        "   AND u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
        [studentId, unitCode, year, period]
    );

    /* UPDATE NEW GROUP ASSIGNMENT AND UPDATE LAB ALLOC IF NEEDED */
    // change the group id of the current group allocation to the new group id
    await promiseBasedQuery(
        "UPDATE group_allocation " +
        "   SET lab_group_id=? " +
        "   WHERE group_alloc_id=?;",
        [newGroupData["lab_group_id"], currentGroupData["group_alloc_id"]]
    );

    // change the student's lab
    if(newGroupData["unit_off_lab_id"] !== currentGroupData["unit_off_lab_id"]) {
        await promiseBasedQuery(
            "UPDATE student_lab_allocation " +
            "SET unit_off_lab_id=? " +
            "WHERE stud_unique_id=? " +
            "AND unit_off_lab_id=?;",
            [newGroupData["unit_off_lab_id"], currentGroupData["stud_unique_id"], currentGroupData["unit_off_lab_id"]]
        );
    }

    res.status(200).send({wip: "test"});
}

const createGroupsCustomScript = (unitOffId, labId, studentsList, groupSize, variance) => {
    let groups = [];
}

module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
}
