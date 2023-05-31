/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const fs = require('fs');
const path = require('path')
const db_connection = require("../db_connection");

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
                    "groupNumber": groupNumber,
                    "labId": group.labId
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
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params
    const studentData = req.body

    // remove labId attribute and filter out object keys in prep for SQL query
    //      e.g. {id: 5, name: 'jim'} becomes [5, 'jim']
    const studentQueryData = studentData.map(({ labId, ...rest }) => Object.values(rest));
    const studentEmails = studentData.map((student) => student.studentEmailAddress);

    // TODO checks to ensure a student does not already exist
    db_connection.query(
        'INSERT INTO student ' +
        '(student_id, last_name, preferred_name, email_address, wam_val, gender) ' +
        'VALUES ?;',
        [studentQueryData],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else {
                //console.log(results);
                //res.status(200).json(results);
            }
        }
    )

    // retrieve these students by email and get their pk, form a unit enrollment with the unit
    const studentKeys = await promiseBasedQuery(
        'SELECT stud_unique_id FROM student WHERE email_address IN ?;',
        [[studentEmails]]
    )

    // get the unique identifier for the unit offering
    const [{unit_off_id}] = await promiseBasedQuery(
        'SELECT unit_off_id FROM unit_offering WHERE ' +
        'unit_code=? AND unit_off_year=? AND unit_off_period=?;',
        [unitCode, year, period]
    )

    // get arrays of [stud id, unitOffId]
    const enrolmentQueryData = studentKeys.map((student) => {
        return [student.stud_unique_id, unit_off_id]
    })

    db_connection.query(
        'INSERT INTO unit_enrolment ' +
        '(stud_unique_id, unit_off_id) ' +
        'VALUES ?;',
        [enrolmentQueryData],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else {
                res.status(200).json(results);
            }
        }
    )
}

// add a single student to a unit
const addStudent = async (req, res) => { }

// delete a single student from a unit
const deleteStudent = (req, res) => { }

// update a student's details
const updateStudent = async (req, res) => { }

// wraps a query in a promise so that we can use await
const promiseBasedQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        db_connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    addStudent,
    deleteStudent,
    updateStudent
};