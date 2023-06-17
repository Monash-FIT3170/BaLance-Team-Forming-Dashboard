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

const defaultGroupSize = 3;
const defaultVariance = 1;
const defaultStrategy = "random";

// get all groups from a unit
const getAllGroups = async (req, res) => {
    /* GET ALL GROUPS */
    // '/:unitCode/:year/:period'
    res.status(200);
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
    } = req.params
    const {
        groupSize,
        variance,
        strategy,
    } = req.body

    console.log("-----------------\n", unitCode, year, period);
    console.log(`group size: ${groupSize}, variance: ${variance}, strat: ${strategy}`);

    /* GET ALL OF THE STUDENTS ASSOCIATED WITH THIS UNIT SORTED BY LAB*/
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

    const unit_off_id = selectUnitOffKey(unitCode, year, period);

    // students = [{stud_unique_id: INT},{stud_unique_id: INT}]

    /* SPLIT BY LAB */
    const labStudents = { }
    students.forEach((student) => {
        if(!labStudents[student.unit_off_lab_id]) { labStudents[student.unit_off_lab_id] = []; }
        labStudents[student.unit_off_lab_id].push(student.stud_unique_id);
    });

    /* RANDOMISE THE, STUDENTS WITHIN EACH LAB NUMBER */
    for(let lab in labStudents) { labStudents[lab] = shuffle(labStudents[lab]); }
    console.log(labStudents)

    /*
    labStudents = [
        lab_id: [student_unique_ids],
        lab_id: [student_unique_ids],
        lab_id: [student_unique_ids],
        lab_id: [student_unique_ids],
    ]
    */

    /* SPLIT THE RANDOMISED LIST INTO GROUPS OF n AS SPECIFIED IN REQ */
    for(let lab in labStudents) { labStudents[lab] = createGroupsRandom(lab, labStudents[lab]); }

    // create the groups
    /* FOR EACH GROUP,  */
    // create the group allocations

    res.status(200).send({wip: "test"});
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

const moveStudent = async (req, res) => {
    /* REQUIRES OFFERING, STUDENT, OLD GROUP, NEW GROUP */
    res.status(200).send({wip: "test"});
}

/* SUPPLEMENTARY FUNCTIONS. TO BE REFACTORED */
const createGroupsRandom = (unitOffId, labId, studentsList) => {
    console.log(`unit id: ${unitOffId}, lab id: ${labId}, students: ${studentsList}`);
    const groups = [];
    return groups;
}


module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups,
    moveStudent
}
