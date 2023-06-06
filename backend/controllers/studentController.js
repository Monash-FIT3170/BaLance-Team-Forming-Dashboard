/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const db_connection = require("../db_connection");

// gets all students for a unit
const getAllStudents = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// get a single student for a unit
const getStudent = async (req, res) => {
    res.status(200).send({wip: "test"});
}

// enroll an array of students to a unit
const addAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params
    const studentData = req.body

    /* INSERT STUDENTS INTO DATABASE */
    // remove the labId attribute from students and filter out object keys in prep for SQL queries
    //      e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
    const studentQueryData = studentData.map(({ labId, ...rest }) => Object.values(rest));
    const studentEmails = studentData.map((student) => student.studentEmailAddress);

    console.log("Inserting students into [student] table")
    db_connection.query( // TODO ensure a student does not already exist as the system is centralised
        'INSERT INTO student ' +
        '(student_id, last_name, preferred_name, email_address, wam_val, gender) ' +
        'VALUES ?;',
        [studentQueryData],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else { console.log(`${results.affectedRows} affected rows`) }
        }
    )

    /* CREATE UNIT ENROLMENT BETWEEN STUDENTS AND UNIT */
    // retrieve student primary key from the database
    const studentKeys = await promiseBasedQuery(
        'SELECT stud_unique_id FROM student WHERE email_address IN ?;',
        [[studentEmails]]
    )

    // get unit offering primary key from the database
    const [{unit_off_id}] = await promiseBasedQuery(
        'SELECT unit_off_id FROM unit_offering WHERE ' +
        'unit_code=? AND unit_off_year=? AND unit_off_period=?;',
        [unitCode, year, period]
    )

    // create a list of unit_enrollment data in the form [stud id, unitOffId] to insert into unit_enrolment table
    const enrolmentQueryData = studentKeys.map((student) => {return [student.stud_unique_id, unit_off_id]})

    console.log("Inserting student enrolments into [unit_enrolment]")
    db_connection.query(
        'INSERT INTO unit_enrolment ' +
        '(stud_unique_id, unit_off_id) ' +
        'VALUES ?;',
        [enrolmentQueryData],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else { console.log(`${results.affectedRows} affected rows`) }
        }
    )

    /* todo CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT */
    // get the highest lab number N and create N labs for this unit
    // where labs are in the format n_activity where n is the lab no.
    console.log("Determining number of labs to create");
    const labs = studentData.map((student) => Number(student.labId.split("-")[0]));
    const numLabs = Math.max(...labs);
    console.log(`Create ${labs} labs`);


    //



    /* todo ALLOCATE STUDENTS TO THEIR RESPECTIVE LABS */
    // get the PK for each of the N labs and for each student, using their pk previously obtained
    // assign to the right lab using a dict {no: labPK}

    /* todo UPDATE ENROLMENT COUNT */
    // can we count enrollment count before? e.g. updated rows? or do a new query?
}

// add a single student to a unit
const addStudent = async (req, res) => {
    /* todo ADD STUDENT IF NOT EXISTS */
    /* todo ADD STUDENT TO UNIT */
    /* todo ADD STUDENT TO LAB */
    /* todo UPDATE UNIT ENROLMENT COUNT */
    res.status(200).send({wip: "test"});
}

// delete a single student from a unit
const deleteStudent = (req, res) => {
    /* todo DON'T DELETE STUDENT AS THEY MIGHT BE IN OTHER UNITS */
    /* todo REMOVE STUDENT FROM UNIT */
    /* todo REMOVE STUDENT FROM GROUPS AND LABS */
    /* todo UPDATE UNIT ENROLMENT COUNT */
    res.status(200).send({wip: "test"});
}

// update a student's details
const updateStudent = async (req, res) => {
    res.status(200).send({wip: "test"});
}

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