/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const fs = require('fs');
const path = require('path')

// gets all students for a unit
const getAllStudents = async (req, res) => {

    let unitId = req.params.unitId;
    let groupsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/groups.json', 'utf8'));

    let students = [];

    for (let i = 0; i < groupsData.length; i++){
        
        let group = groupsData[i]

        

        if (group.unitCode == unitId){

            let members = group.members;
            let groupId = group.groupId
            let groupNumber = group.groupNumber

            for (let j = 0; j < members.length; j++){

                let student = members[j]
                student.group = {
                    "groupdId": groupId,
                    "groupNumber": groupNumber
                }

                students.push(student)

            }
        }


    }

    res.status(200).send(students);

 }

// get a single student for a unit
const getStudent = async (req, res) => { }

// add an array of students to a unit
const addAllStudents = async (req, res) => {

    let students = req.body;
    let unitId = req.params.unitId;

    let studentJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/students.json', 'utf8'));
    let units = JSON.parse(fs.readFileSync(path.join(__dirname, '../db') + '/units.json', 'utf8'));

    let unit;
    for (let i = 0; i < units.length; i++){
        if (units[i].unitCode == unitId){
            unit = units[i];
            units.splice(i, 1);
            break;
        }
    }
    
    for (let i = 0; i < students.length; i++){
        let student = students[i];
        let unitDetails = [unitId, student.labId, true];
        let exists = false;

        for (let j = 0; j < studentJSON.length; j++){

            if (studentJSON[j].studentId == student.studentId){

                student = studentJSON[j]
                let unitExists = false

                for (let k = 0; k < student.units.length; k++){
                    if (unitDetails[0] == student.units[k][0]){
                        if (unitDetails[1] != student.units[k][1]){
                            student.units[k][1] = unitDetails[1];
                        }
                        unitExists = true;
                        break;
                    }
                }

                if (!unitExists){
                    unit.students.push(student.studentId)
                    student.units.push(unitDetails);
                }
                exists = true
                break;

            }

        }

        if (!exists){

            studentObject = {
                studentId: student.studentId,
                studentFirstName: student.studentFirstName,
                studentLastName: student.studentLastName,
                studentEmailAddress: student.studentEmailAddress,
                wamAverage: student.wamAverage,
                gender: student.gender,
                units: [unitDetails]
            }
            unit.students.push(student.studentId)
            studentJSON.push(studentObject)
        }
    }

    units.push(unit);

    fs.writeFileSync(path.join(__dirname, '../db') + '/units.json', JSON.stringify(units));
    fs.writeFileSync(path.join(__dirname, '../db') + '/students.json', JSON.stringify(studentJSON));

    res.sendStatus(200);
 }

// add a single student to a unit
const addStudent = async (req, res) => { }

// delete a single student from a unit
const deleteStudent = (req, res) => { }

// update a student's details
const updateStudent = async (req, res) => { }

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    addStudent,
    deleteStudent,
    updateStudent
};