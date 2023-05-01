/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */

const fs = require('fs');
const path = require('path')
const { UUID } = require('sequelize');
//let students = fs.readFileSync(path.join(__dirname, '../db') + '/students.json', 'utf8');
//let units = fs.readFileSync(path.join(__dirname, '../db') + '/units.json', 'utf8');
//let groups = fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8');


// get all groups from a unit
const getAllGroups = async (req, res) => {
    let unitId = req.params.unitId;

    let units = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/units.json', 'utf8'));
    let groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));

    let unitGroups = []
    let unit;

    for (let i = 0; i < units.length; i++){

        if (units[i].unitCode == unitId){

            unit = units[i];
            break;

        }

    }

    for (let i = 0; i < unit.groups.length; i++){

        for (let j = 0; j < groups.length; j++){

            if (unit.groups[i] == groups[j].groupId){


                unitGroups.push(groups[j])
                break;

            }

        }

    }


    res.json(unitGroups);
}

// get a single group from a unit
const getGroup = async (req, res) => {
    let unitId = req.params.unitId;
    let groupId = req.params.group

    let groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));
    let group;

    for (let i = 0; i < groups.length; i++){

        if (groups[i].groupdId == groupId){

            group = groups[i]

        }


    }

    //group = JSON.stringify(group);
    res.send(group);
}

// create all of the groups (based on csv)
const createUnitGroups = async (req, res) => {
    let unitId = req.params.unitId;
    let groupSize = req.body.groupSize;
    let strategy = req.body.strategy;
    let variance = req.body.variance;

    let students = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/students.json', 'utf8'));
    let units = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/units.json', 'utf8'));
    let groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));

    let unit;
    for (let i = 0; i < units.length; i++){
        if (units[i].unitCode == unitId){
            unit = units[i];
            units.splice(i, 1);
            break;
        }
    }

    let unitStudents = []
    for (let i = 0; i < unit.students.length; i++){
        for (let j = 0; j < students.length; j++){
            if (students[j].studentId == unit.students[i]){
                let lab;

                for (let k = 0; k < students[j].units.length; k++){
                    if (students[j].units[k][0] == unit.unitCode){
                        lab = students[j].units[k][1];
                    }
                }
                unitStudents.push([students[j], lab]);
            }
        }
    }

    unitStudents.sort((a, b) => a[1] - b[1]);

    let createdGroups = [];

    unassignedStudents = [];

    for (let i = 0; i < unitStudents.length; i = i + groupSize){
        let groupIndex = Math.floor(i/groupSize) + 1;

        if (i + groupSize - 1 < unitStudents.length && unitStudents[i][1] == unitStudents[i + groupSize - 1][1]){
            let groupStudents = unitStudents.slice(i, i + groupSize)

            let newGroup = {
                groupId: unit.unitCode + "00" + groupIndex,
                groupNumber: groupIndex,
                unitCode: unitId,
                labId: "",
                members: []
            }

            newGroup.labId = unitStudents[i][1];

            for (let j = 0; j < groupStudents.length; j++){

                newGroup.members.push(groupStudents[j][0])

            }

            createdGroups.push(newGroup);

        }
        else {

            let groupStudents = unitStudents.slice(i, i + groupSize)
            for (let j = 0; j < groupStudents.length; j++){
                unassignedStudents.push(groupStudents[j])
            }
        }
    }

    //console.log(unassignedStudents)

    for (let i = 0; i < unassignedStudents.length; i++){
        let lab = unassignedStudents[i][1];
        let groupFound = false;

        for (let j = 0; j < createdGroups.length; j++){
            if (createdGroups[j].labId == lab && createdGroups[j].members.length < groupSize + variance){
                createdGroups[j].members.push(unassignedStudents[i][0]);
                groupFound = true;
                break;
            }
        }

        if (!groupFound){
            let groupIndex = createdGroups.length + 1;
            let newGroup = {
                groupId: unit.unitCode + "00" + groupIndex,
                groupNumber: groupIndex,
                unitCode: unitId,
                labId: "",
                members: []
            }

            newGroup.labId = lab;
            newGroup.members.push(unassignedStudents[i][0])
            createdGroups.push(newGroup);
        }
    }

    for (let i = 0; i < createdGroups.length; i++){
        unit.groups.push(createdGroups[i].groupId)
    }

    units.push(unit);

    groups = groups.concat(createdGroups)

    console.log(groups)

    fs.writeFileSync(path.join(__dirname, '../db') + '/groups.json', JSON.stringify(groups));
    fs.writeFileSync(path.join(__dirname, '../db') + '/units.json', JSON.stringify(units));

    res.send(createdGroups);
}

// add a new group to a unit
const addGroup = async (req, res) => {
    // takes the group info from the req body
    const groupId = req.params.groupId;


    // creates the group document


    // appends to the groups.json

    res.status(200).json({
        group: "group added"
    })
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
    // takes an id

    // searches groups.json for the document containing the id

    // filters and then updates groups.json

    res.status(200).json({
        group: "group deleted"
    })
}

// update a specific group from a unit
const updateGroup = async (req, res) => {
    res.status(200).json({
        group: "group updated"
    })
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
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
    createUnitGroups
}