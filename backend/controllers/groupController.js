/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */

const fs = require('fs');
const path = require('path')
const { UUID } = require('sequelize');

// get all groups from a unit
const getAllGroups = async (req, res) => {
    let { unitId } = req.params;
    let groupsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));

    const resData = groupsData.filter((group) => { // filter the groups by unitId
        return group.unitCode === unitId;
    }).map((group) => { // remove unwanted attributes from group data
        return {
            groupId: group["groupId"],
            groupNumber: group["groupNumber"],
            members: group["members"]
        }
    });

    res.status(200).send(resData);
}

// get a single group from a unit
const getGroup = async (req, res) => {
    let unitId = req.params.unitId;
    let groupId = req.params.group

    let groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));
    let group;

    for (let i = 0; i < groups.length; i++){
        if (groups[i].groupdId === groupId){
            group = groups[i]
        }
    }

    res.send(group);
}

// create all the groups (based on csv)
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
    const unitsFile = './db/units.json';
    const groupsFile = './db/groups.json';
    // takes the group info from the req body and creates the group document
    const newGroup = {
        groupId,
        groupNumber,
        unitCode,
        members,
        labId
    } = req.body;

    // read both files and update them

    // read files
    try {
        // read files
        let groupsData = await fs.promises.readFile(groupsFile, 'utf-8');
        let unitsData = await fs.promises.readFile(unitsFile, 'utf-8');

        // parse file data for use
        groupsData = JSON.parse(groupsData);
        unitsData = JSON.parse(unitsData);

        // add the new group to both groupsData and unitsData
        let unitIdx = unitsData.findIndex(unit => unit["unitCode"] === newGroup["unitCode"]);
        unitsData[unitIdx]["groups"].push(newGroup);
        groupsData.push(newGroup);

        // write data to files
        fs.writeFile(unitsFile, JSON.stringify(unitsData), (err) => {console.log(err);});
        fs.writeFile(groupsFile, JSON.stringify(groupsData), (err) => {console.log(err);});

        res.status(200).send(newGroup);
    } catch (readFileErr) {
        console.log(readFileErr);
        res.status(500).json({ err: readFileErr })
    }
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
    const unitsFile = './db/units.json';
    const groupsFile = './db/groups.json';
    // takes the group info from the req body and creates the group document
    const { unitId, groupId } = req.params;

    // read files
    try {
        // read files
        let groupsData = await fs.promises.readFile(groupsFile, 'utf-8');
        let unitsData = await fs.promises.readFile(unitsFile, 'utf-8');

        // parse file data for use
        groupsData = JSON.parse(groupsData);
        unitsData = JSON.parse(unitsData);

        // filter the item to delete from the groups DB
        const remainingGroups = groupsData.filter((group) => {
            return !(group.unitCode === unitId && group.groupId === groupId);
        });
        // store the deleted group to res.send() back as confirmation
        const deletedGroup = groupsData.filter((group) => {
            return group.unitCode === unitId && group.groupId === groupId;
        });

        // get the index of this unit
        let unitIdx = unitsData.findIndex((unit) => {
            return unit.unitCode === unitId;
        });
        // get the units groups and remove the deleted unit
        unitsData[unitIdx].groups = unitsData[unitIdx].groups.filter((group) => {
            return !(group.unitCode === unitId && group.groupId === groupId);
        });

        // write data to files
        fs.writeFile(unitsFile, JSON.stringify(unitsData), (err) => {console.log(err);});
        fs.writeFile(groupsFile, JSON.stringify(remainingGroups), (err) => {console.log(err);});

        res.status(200).send(deletedGroup);
    } catch (readFileErr) {
        res.status(500).json({ err: readFileErr })
    }

}

// update a specific group from a unit
const updateGroup = async (req, res) => {
    const groupsFile = './db/groups.json';
    const { unitId, groupId } = req.params;
    const updatedGroupData = req.body;

    try {
        // Read the groups file
        let groupsData = await fs.promises.readFile(groupsFile, 'utf-8');

        // Parse the file data for use
        groupsData = JSON.parse(groupsData);

        // Find the index of the group to update
        let groupIdx = groupsData.findIndex(group => group.unitCode === unitId && group.groupId === groupId);

        // Check if group exists
        if (groupIdx === -1) {
            res.status(404).send({ message: 'Group not found' });
            return;
        }

        // Update the group data
        for (const key in updatedGroupData) {
            if (groupsData[groupIdx].hasOwnProperty(key)) {
                groupsData[groupIdx][key] = updatedGroupData[key];
            }
        }

        // Write the updated data to the groups file
        fs.writeFile(groupsFile, JSON.stringify(groupsData), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error updating group data' });
            } else {
                res.status(200).send(groupsData[groupIdx]);
                res.status(200).json({
                    group: "group updated"
                })
            }
        });

    } catch (readFileErr) {
        console.log(readFileErr);
        res.status(500).json({ err: readFileErr })
    }
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
