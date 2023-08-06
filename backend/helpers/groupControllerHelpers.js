/**
 * A module containing helper functions specifically used to implement
 * groupController.js controller functions
 *
 * */

const {promiseBasedQuery, selectUnitOffKey} = require("./commonHelpers");

const shuffle = (array) => {
    /**
     *     Fisher-Yates shuffle algorithm from
     *     https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const createGroupsRandom = async (unitCode, year, period, groupSize, variance) => {
    /**
     * Given a unit offering, group size and acceptable group variance from a group size,
     * forms groups within the units labs randomly
     *
     */

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

    /* SPLIT BY LAB | labStudents = [ lab_id: [student_unique_ids], lab_id: [student_unique_ids] ] */
    const labStudents = { };
    students.forEach((student) => {
        if(!labStudents[student.unit_off_lab_id]) { labStudents[student.unit_off_lab_id] = []; }
        labStudents[student.unit_off_lab_id].push(student.stud_unique_id);
    });

    /* RANDOMISE THE, STUDENTS WITHIN EACH LAB NUMBER */
    /* THEN SPLIT THE RANDOMISED LIST INTO GROUPS OF n AS SPECIFIED IN REQ */
    for(let lab in labStudents) { labStudents[lab] = shuffle(labStudents[lab]); }
    for(let lab in labStudents) {
        labStudents[lab] = splitGroupsRandom(unitOffId, lab, labStudents[lab], groupSize, variance);
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

}

const createGroupsEffort = async (unitCode, year, period, groupSize, variance) => {
    /**
     * Given a unit offering, group size and acceptable group variance from a group size,
     * forms groups within the units labs using student average assignment marks and
     * amount of hours they want to dedicate to the unit
     *
     */

}

const createGroupsBelbin = async (unitCode, year, period, groupSize, variance) => {
    /**
     * Given a unit offering, group size and acceptable group variance from a group size,
     * forms groups within the units labs using student Belbin types
     *
     */

}

const groupFormationStrategies = {
    /**
     * A store of various group formation strategies that can be called by their key
     *
     */

    "random": createGroupsRandom,
    "effort": createGroupsEffort,
    "belbin": createGroupsBelbin,
}

const splitGroupsRandom = (unitOffId, labId, studentsList, groupSize, variance) => {
    /**
     * Splits students into groups of groupSize +/- variance
     *
     */

    let groups = [];
    for (let i = 0; i < studentsList.length; i += groupSize) {
        const group = studentsList.slice(i, i + groupSize);
        groups.push(group);
    }

    const numFullGroups = studentsList.length / groupSize;
    const numRemStud = studentsList.length % groupSize; // students who didn't end up in full groups i.e. remainder
    const lastGroup = groups[groups.length - 1]

    // console.log(`size: ${groupSize}, ${typeof groupSize} variance: ${variance}, ${typeof variance}`)
    // console.log("Full groups before adjustment")
    // console.log(groups);

    // if we cannot form even groups from all students or the last group is not within variance limits
    if (numRemStud !== 0 && numRemStud < groupSize - variance) {
        // can the students not in a full group be shared between full groups?
        if (numRemStud / numFullGroups <= variance) {
            // consider variance > 1, enclose in a for(i=0 i<variance) or do i%variance todo
            // students not in a full group are distributed amongst the full groups until no more remain
            let lastGroupLen = lastGroup.length; // defined here to avoid re-evaluation of value in loop condition
            for (let i = 0; i < lastGroupLen; i++) {
                // console.log("group that is to be distributed")
                // console.log(groups[i])
                groups[i].push(lastGroup.pop());
            }
            groups.pop();
        }
        // can the remainder borrow from full groups without validating size constraints?
        else if (numRemStud + variance * numFullGroups >= groupSize - variance) { // don't overestimate borrow todo
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
            return splitGroupsRandom(unitOffId, labId, studentsList, groupSize - 1, variance)
        }
    }

    // console.log("Groups after adjustments")
    // console.log(groups)
    return groups;
}

module.exports = {
    groupFormationStrategies,
    shuffle
}