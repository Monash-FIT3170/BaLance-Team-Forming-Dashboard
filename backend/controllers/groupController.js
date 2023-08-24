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
} = require("../helpers/groupControllerHelpers")

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
// DRAFT OF getGroup, testing in progress
// const getGroup = async (req, res) => {
//     const {
//         unitCode,
//         year,
//         period,
//         groupNumber // assuming group number is part of the request parameters
//     } = req.params;

//     /* GET A SPECIFIC GROUP */
//     const groupData = await promiseBasedQuery(
//         'SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, l_group.group_number, lab.lab_number ' +
//         'FROM student stud ' +
//         'INNER JOIN group_allocation g_alloc ON stud.stud_unique_id=g_alloc.stud_unique_id ' +
//         'INNER JOIN lab_group l_group ON g_alloc.lab_group_id=l_group.lab_group_id ' +
//         'INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_group.unit_off_lab_id ' +
//         'INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id ' +
//         'WHERE' +
//         '   unit.unit_code=? ' +
//         '   AND unit.unit_off_year=? ' +
//         '   AND unit.unit_off_period=? ' +
//         '   AND l_group.group_number=? ' +
//         'ORDER BY l_group.group_number;',
//         [unitCode, year, period, groupNumber]
//     );

//     const group = {group_number: groupNumber, lab_number: groupData[0].lab_number, students: []};
//     for(let i=0; i<groupData.length; i++) {
//         // add student to the groups list of students
//         const {
//             student_id,
//             preferred_name,
//             last_name,
//             email_address,
//             wam_val
//         } = groupData[i];

//         group.students.push({
//             student_id: student_id,
//             preferred_name: preferred_name,
//             last_name: last_name,
//             email_address: email_address,
//             wam_val: wam_val
//         });
//     }

//     res.status(200).send(group);
// }



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

/* SUPPLEMENTARY FUNCTIONS. TO BE REFACTORED */
//MIGHT RUN OUT OF MEMORY STACK
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
    createUnitGroups,
    shuffleUnitGroups,
    moveStudent
}
