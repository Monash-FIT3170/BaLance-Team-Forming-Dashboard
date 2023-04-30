/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */

const fs = require('fs');
const path = require('path')
const { UUID } = require('sequelize');
let students = fs.readFileSync(path.join(__dirname, '../db') + '/students.json', 'utf8');
let units = fs.readFileSync(path.join(__dirname, '../db') + '/units.json', 'utf8');
let groups = fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8');


// get all groups from a unit
const getAllGroups = async (req, res) => {
    let unitId = req.params.unitId;
    
    let groups = [
        {
            groupId: "001",
            groupNumber: "1",
            labId: "Lab01",
            members:  [
                {
                    studentFirstName: "Steve", 
                    studentLastName: "Jobs", 
                    studentEmail: "steve.jobs@apple.com"
                }, 
                {
                    studentFirstName: "Bill", 
                    studentLastName: "Gates", 
                    studentEmail: "bill.gates@microsoft.com"
                },
                {
                    studentFirstName: "Linus", 
                    studentLastName: "Torvalds", 
                    studentEmail: "linus.torvalds@linux.com"
                }
            ],
        },
        {
            groupId: "002",
            groupNumber: "2",
            labId: "Lab02",
            members:  [
                {
                    studentFirstName: "Michael", 
                    studentLastName: "Jordan", 
                    studentEmail: "michael.jordan@chicago.com"
                }, 
                {
                    studentFirstName: "LeBron", 
                    studentLastName: "James", 
                    studentEmail: "lebron.james@cleveland.com"
                },
                {
                    studentFirstName: "Kobe", 
                    studentLastName: "Bryant", 
                    studentEmail: "kobe.bryant@la.com"
                }
            ],
        }
    ]

    //groups = JSON.stringify(groups);
    
    res.send(groups);
}

// get a single group from a unit
const getGroup = async (req, res) => {
    let unitId = req.params.unitId;
    let groupId = req.params.group
    
    let group = {
        groupId: "001",
        groupNumber: "1",
        labId: "Lab01",
        members:  [
            {
                studentFirstName: "Steve", 
                studentLastName: "Jobs", 
                studentEmail: "steve.jobs@apple.com"
            }, 
            {
                studentFirstName: "Bill", 
                studentLastName: "Gates", 
                studentEmail: "bill.gates@microsoft.com"
            },
            {
                studentFirstName: "Linus", 
                studentLastName: "Torvalds", 
                studentEmail: "linus.torvalds@linux.com"
            }
        ],
    }

    //group = JSON.stringify(group);

    res.send(group);
}

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

    //console.log(unit)

    //console.log(createdGroups);
    
    //createdGroupsJSON = JSON.stringify(createdGroups);
    //fs.writeFileSync('../db/groups.json', createdGroupsJSON);

    res.send(createdGroups);


}

// add a new group to a unit
const addGroup = async (req, res) => {
    res.status(200).json({
        group: "group added"
    })
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
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