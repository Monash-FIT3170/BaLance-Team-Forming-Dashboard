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

    // TODO remove after implementation is complete
    db_connection.query('DELETE FROM students;', (err, res, fields) => { })

    /* INSERT STUDENTS INTO DATABASE */
    // remove the labId attribute from students and filter out object keys in prep for SQL queries
    //      e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
    // FIXME: bring up data sent to backend as the keys shouldn't change or else its breaking
    const studentInsertData = studentData.map(({ labId, enrolmentStatus, discPersonality, ...rest }) => {
        console.log(rest)
        return Object.values(rest);
    });
    const studentEmails = studentData.map((student) => student.studentEmailAddress);

    console.log(studentInsertData)
    console.log("Inserting students into [student] table")
    await promiseBasedQuery( // TODO ensure a student does not already exist as the system is centralised
        'INSERT INTO student ' +
        '(student_id, last_name, preferred_name, email_address, wam_val, gender) ' +
        'VALUES ?;',
        [studentInsertData]
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
    const enrolmentInsertData = studentKeys.map((student) => {return [student.stud_unique_id, unit_off_id]})
    console.log("Inserting student enrolments into [unit_enrolment]")
    await promiseBasedQuery(
        'INSERT INTO unit_enrolment (stud_unique_id, unit_off_id) VALUES ?;',
        [enrolmentInsertData]
    )

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT */
    // get the highest lab number N and create N labs for this unit
    // where labs are in the format n_activity where n is the lab no.
    console.log("Determining number of labs to create");
    // [unit_off_id, short_code,] todo can i make lab enrolment here
    let numLabs = 0
    for(student in studentData) {
        let labId = student.labId;
        let split = labId.split("_");
        let labNum = Number(split[0]);
        numLabs = (labNum > numLabs) ? labNum : numLabs;
    }
    console.log(`Create ${numLabs} labs`);

    let labInsertData = []
    for (let i=1; i<=numLabs; i++) {
        let lab = [unit_off_id, i];
        labInsertData.push(lab);
    }

    console.log(labInsertData)
    await promiseBasedQuery('INSERT INTO unit_off_lab (unit_off_id, lab_number) VALUES ?', labInsertData)

    /* todo ALLOCATE STUDENTS TO THEIR RESPECTIVE LABS */
    // we need [unit_off_lab_id, student_unique_id] and the link is with student lab in student data
    const unit_off_labs = await promiseBasedQuery('SELECT * FROM unit_off_lab WHERE unit_off_id=?;', [unit_off_id])

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
                console.log(`${results.affectedRows} affected rows`)
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