/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */
const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

const {
    groupFormationStrategies,
    shuffle
} = require("../helpers/groupControllerHelpers")

const {insertUnitOffLabs} = require("../helpers/studentControllerHelpers");


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
        //console.log(i, studentData[i+1]['groupNumber'], studentData[i]['groupNumber'])
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
    const {
        groupSize,
        variance,
        strategy,
    } = req.body;

    /* GET ALL OF THE STUDENTS ASSOCIATED WITH THIS UNIT SORTED BY LAB */
    const unitOffId = await selectUnitOffKey(unitCode, year, period);
    const students = await promiseBasedQuery(
        'SELECT stud.stud_unique_id, alloc.unit_off_lab_id ' +
        'FROM student stud ' +
        'INNER JOIN student_lab_allocation alloc ON stud.stud_unique_id=alloc.stud_unique_id ' +
        'INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=alloc.unit_off_lab_id ' +
        'INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id ' +
        'WHERE ' +
        '   unit.unit_code=? ' +
        '   AND unit.unit_off_year=? ' +
        '   AND unit.unit_off_period=? ' +
        'ORDER BY unit_off_lab_id;',
        [unitCode, year, period]
    );

    // students = [{stud_unique_id: INT},{stud_unique_id: INT}]
    // console.log("-----------------\n", unitCode, year, period);
    console.log(`group size: ${groupSize}, variance: ${variance}, strat: ${strategy}`);

    /* SPLIT BY LAB | labStudents = [ lab_id: [student_unique_ids], lab_id: [student_unique_ids] ] */
    const labStudents = { };
    students.forEach((student) => {
        if(!labStudents[student.unit_off_lab_id]) { labStudents[student.unit_off_lab_id] = []; }
        labStudents[student.unit_off_lab_id].push(student.stud_unique_id);
    });

    /* RANDOMISE THE, STUDENTS WITHIN EACH LAB NUMBER todo randomise first or get random index when assigning? */
    /* THEN SPLIT THE RANDOMISED LIST INTO GROUPS OF n AS SPECIFIED IN REQ */
    for(let lab in labStudents) { labStudents[lab] = shuffle(labStudents[lab]); }
    for(let lab in labStudents) {
        labStudents[lab] = createGroupsRandom(unitOffId, lab, labStudents[lab], groupSize, variance);
    }

    /* INSERT THE NEW GROUPS INTO THE DATABASE */
    // determine the number of groups to be inserted to database -> inserted as [unit_off_lab_id, group_number]
    const groupInsertData = [];
    let numGroups = 0;
    for(let lab in labStudents) {
        labStudents[lab].forEach((student) => {
            numGroups++;
            groupInsertData.push([lab, numGroups]);
        })
    }

    await promiseBasedQuery(
        'INSERT IGNORE INTO lab_group (unit_off_lab_id, group_number) VALUES ?;',
        [groupInsertData]
    );

    /* INSERT THE ALLOCATIONS TO GROUPS INTO THE DATABASE */
    // get all groups in this unit as [ >> group_id <<, lab_id]
    const groupAllocInsertData = [];
    const groupData = await promiseBasedQuery(
        'SELECT g.lab_group_id, g.unit_off_lab_id ' +
        'FROM lab_group g ' +
        'INNER JOIN unit_off_lab l ON g.unit_off_lab_id=l.unit_off_lab_id ' +
        'INNER JOIN unit_offering u ON u.unit_off_id=l.unit_off_id ' +
        'WHERE ' +
        '   u.unit_code=? ' +
        '   AND u.unit_off_year=? ' +
        '   AND u.unit_off_period=?;',
        [unitCode, year, period]
    );

    // for each group, pop a group from the lab key in object and form the allocation
    for(let i=0; i<numGroups; i++) {
        const group = groupData.pop();
        const groupStudents = labStudents[group.unit_off_lab_id].pop()
        groupStudents.forEach((studentId) => { groupAllocInsertData.push([studentId, group.lab_group_id]) })
    }

    // student allocations are created as [~~group_alloc_id~~, stud_unique_id, lab_group_id]
    await promiseBasedQuery(
        'INSERT IGNORE INTO group_allocation (stud_unique_id, lab_group_id) VALUES ?;',
        [groupAllocInsertData]
    );

    res.status(200).send();
}

// re-create (shuffle) unit groups
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
    /* DELETE THE STUDENT ALLOCATIONS BUT NOT STUDENTS */
    /* DELETE THE GROUP ASSOCIATION WITH LAB/UNIT */
    /* DELETE THE GROUP ITSELF */
    res.status(200).send({wip: "test"});
}

// update a specific group from a unit
const updateGroup = async (req, res) => {
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

    /* todo DELETE PREVIOUS GROUP ASSIGNMENT AND LAB IF NEW LAB */

    /* todo CREATE NEW GROUP ASSIGNMENT AND LAB IF NEW LAB */

    res.status(200).send({wip: "test"});
}

/* SUPPLEMENTARY FUNCTIONS. TO BE REFACTORED */
const createGroupsRandom = (unitOffId, labId, studentsList, groupSize, variance) => {
    // console.log(`| unit id: ${unitOffId} | lab id: ${labId} | students: ${studentsList} |`);
    let groups = [];
    for (let i = 0; i < studentsList.length; i += groupSize) {
        const group = studentsList.slice(i, i + groupSize);
        groups.push(group);
    }

    const numFullGroups = studentsList.length / groupSize;
    const numRemStud = studentsList.length % groupSize; // students who didn't end up in full groups i.e. remainder
    const lastGroup = groups[groups.length - 1]

    console.log(`size: ${groupSize}, ${typeof groupSize} variance: ${variance}, ${typeof variance}`)
    console.log("Full groups before adjustment")
    console.log(groups);

    // if we cannot form even groups from all students or the last group is not within variance limits
    if (numRemStud !== 0 && numRemStud < groupSize - variance) {
        // can the students not in a full group be shared between full groups?
        if (numRemStud / numFullGroups <= variance) {
            // todo consider variance > 1, enclose in a for(i=0 i<variance) or do i%variance
            // students not in a full group are distributed amongst the full groups until no more remain
            let lastGroupLen = lastGroup.length; // defined here to avoid re-evaluation of value in loop condition
            for (let i = 0; i < lastGroupLen; i++) {
                console.log("group that is to be distributed")
                console.log(groups[i])
                groups[i].push(lastGroup.pop());
            }
            groups.pop();
        }
        // can the remainder borrow from full groups without validating size constraints?
        else if (numRemStud + variance * numFullGroups >= groupSize - variance) { // todo don't overestimate borrow
            // borrow from full groups until last group is within size constraints
            for (let i = 0; i <= (groups.length - 1) * variance; i++) {
                // borrow from full group only if it doesnt break size constraints
                if (groups[i % variance].length - variance >= groupSize - variance) {
                    lastGroup.push(groups[i].pop());
                }
            }
            groups.pop();
        }
        // split the groups as evenly as possible
        else {
            return createGroupsRandom(unitOffId, labId, studentsList, groupSize - 1, variance)
        }
    }

    console.log("Groups after adjustments")
    console.log(groups)

    return groups;
}

module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
}
