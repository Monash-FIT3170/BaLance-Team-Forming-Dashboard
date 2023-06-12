/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */
const {promiseBasedQuery} = require("../helpers/commonHelpers");
const {
    groupFormationStrategies
} = require("../helpers/groupControllerHelpers")

const defaultGroupSize = 3;
const defaultVariance = 1;
const defaultStrategy = "random";

// get all groups from a unit
const getAllGroups = async (req, res) => {
    /* GET ALL GROUPS */
    // '/:unitCode/:year/:period'
    res.status(200).send({wip: "test"});
}

// get a single group from a unit
const getGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// create all the groups (based on csv)
const createUnitGroups = async (req, res) => {
    /* todo CURRENTLY RANDOMISE GROUPS */
    // '/:unitCode/:year/:period'

    /* GET ALL OF THE STUDENTS ASSOCIATED WITH THIS UNIT */
    /* SORT THEM BY LAB NUMBER can do in the query */
    /* RANDOMISE THE, STUDENTS WITHIN EACH LAB NUMBER */

    /* SPLIT THE RANDOMISED LIST INTO GROUPS OF n AS SPECIFIED IN REQ */
    /* FOR EACH GROUP,  */
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

module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups,
    moveStudent
}
