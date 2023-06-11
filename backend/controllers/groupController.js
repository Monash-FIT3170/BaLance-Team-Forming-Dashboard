/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */
const db_connection = require("../db_connection");

const defaultGroupSize = 3;
const defaultVariance = 1;
const defaultStrategy = "random";

// get all groups from a unit
const getAllGroups = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// get a single group from a unit
const getGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// create all the groups (based on csv)
const createUnitGroups = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// add a new group to a unit
const addGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// update a specific group from a unit
const updateGroup = async (req, res) => {
    res.status(200).send({wip: "test"});
}

const moveStudent = async (req, res) => {
    res.status(200).send({wip: "test"});
}

/* SUPPLEMENTARY FUNCTIONS */
/* ----------------------- */
const promiseBasedQuery = (query, values) => {
    /**
     * wraps a mysql2 query around a promise so that we can use await with queries
     */
    return new Promise((resolve, reject) => {
        db_connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(`${results.affectedRows} affected rows`)
                resolve(results);
            }
        });
    });
}

function shuffle(array) {
    // Fisher-Yates shuffle algorithm from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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

module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups,
    moveStudent
}
