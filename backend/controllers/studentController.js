/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const db_connection = require("../db_connection");

/* CONTROLLER FUNCTIONS */
// gets all students for a unit
const getAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params

    // todo assess improvements from student enrolment containing code, year, period
    const studentsData = await promiseBasedQuery(
        "SELECT student_id, preferred_name, last_name, email_address FROM student " +
        "INNER JOIN unit_enrolment ON student.stud_unique_id=unit_enrolment.stud_unique_id " +
        "INNER JOIN unit_offering ON unit_offering.unit_off_id=unit_enrolment.unit_off_id " +
        "WHERE " +
        "unit_offering.unit_code=? " +
        "AND unit_offering.unit_off_year=? " +
        "AND unit_offering.unit_off_period=?; ",
        [unitCode, year, period]
    )

    res.status(200).json(studentsData);
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
    const requestBody = req.body

    /* INSERT STUDENTS INTO DATABASE */
    // get the attributes we need and their values in prep for SQL queries
    //   e.g. {id: 5, name: 'jim'} becomes [5, 'jim'] to comply with mysql2 API
    const studentInsertData = requestBody.map(
        ({ labId, enrolmentStatus, discPersonality, ...rest }) => {return Object.values(rest);}
    );
    await insertStudents(studentInsertData)

    /* CREATE UNIT ENROLMENT BETWEEN STUDENTS AND UNIT */
    const studentEmails = requestBody.map((student) => student.studentEmailAddress);
    const studentKeys = await selectStudentsKeys(studentEmails);
    const unit_off_id = await selectUnitOffKey(unitCode, year, period);
    await insertStudentEnrolment(studentKeys, unit_off_id);

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
    await insertUnitOffLabs(requestBody, unit_off_id); // ensure only 1 lab number of value n, per unit offering
    await insertStudentLabAllocations(requestBody, unit_off_id);

    res.status(200).send();
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

/* SUPPLEMENTARY QUERY FUNCTIONS */
/* ----------------------------- */
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

const insertStudents = async (studentInsertData) => {
    /**
     * given a list of student data in the form of an array, uploads the data
     * taking into consideration if a student already exists on the database or not
     */
    try {
        // TODO ensure a student does not already exist as the system is centralised
        return promiseBasedQuery(
            'INSERT IGNORE INTO student ' +
            '(student_id, last_name, preferred_name, email_address, wam_val, gender) ' +
            'VALUES ?;',
            [studentInsertData]
        )
    } catch(error) {
        throw error
    }
}

const selectStudentsKeys = async (studentEmails) => {
    /**
     * obtains the list of primary keys for the students associated with the list of emails provided
     * result is used to form enrolment data for a unit offering
     */
    try {
        return promiseBasedQuery(
            'SELECT stud_unique_id FROM student WHERE email_address IN ?;',
            [[studentEmails]]
        );
    } catch(error) {
        throw error;
    }
}

const selectUnitOffKey = async (unitCode, year, period) => {
    /**
     * obtains the primary key for a unit offering
     * result is used to form enrolment fata for that unit offering
     */
    try {
        const [{unit_off_id}] = await promiseBasedQuery(
            'SELECT unit_off_id FROM unit_offering WHERE ' +
            'unit_code=? AND unit_off_year=? AND unit_off_period=?;',
            [unitCode, year, period]
        )
        return unit_off_id;
    } catch(error) {
        throw error
    }
}

const insertStudentEnrolment = async (studentKeys, unit_off_id) => {
    /**
     * adds enrolment data given an array of student keys and a unit offering id,
     */
    try {
        const enrolmentInsertData = studentKeys.map((student) => {return [student.stud_unique_id, unit_off_id]})
        return promiseBasedQuery(
            'INSERT IGNORE INTO unit_enrolment (stud_unique_id, unit_off_id) VALUES ?;',
            [enrolmentInsertData]
        )
    } catch(error) {
        throw error
    }
}

const insertUnitOffLabs = async (requestBody, unit_off_id) => {
    /**
     * Given a list of students from a request body, determines the number of labs
     * in an offering and creates them in the database
     */
    try {
        // get the highest lab number N and create N labs for this unit
        // where labs are in the format n_activity where n is the lab no.
        let numLabs = 0
        for(student of requestBody) {
            let labId = student.labId;
            let split = labId.split("_");
            let labNum = Number(split[0]);
            numLabs = (labNum > numLabs) ? labNum : numLabs;
        }

        // formulate data into the desired format: [unit_off_id, lab_number]
        let labInsertData = []
        for (let i=1; i<=numLabs; i++) {
            let lab = [unit_off_id, i];
            labInsertData.push(lab);
        }

        return promiseBasedQuery('INSERT IGNORE INTO unit_off_lab (unit_off_id, lab_number) VALUES ?;', [labInsertData])
    } catch(error) {
        throw error
    }
}

const insertStudentLabAllocations = async (requestBody, unit_off_id) => {
    try {
        /* SELECT labs and create a dictionary of form
        * {
        *   01: pk for lab 01,
        *   02: pk for lab 02,
        *   03: pk for lab 03 ...
        * }
        * */
        const unit_off_labs = await promiseBasedQuery('SELECT * FROM unit_off_lab WHERE unit_off_id=?;', [unit_off_id]);
        const labNumberPrimaryKeyPairs = {};
        const studentLabNumberAllocation = {};
        unit_off_labs.forEach((lab, index) => {
            labNumberPrimaryKeyPairs[lab.lab_number] = lab.unit_off_lab_id;
            studentLabNumberAllocation[lab.lab_number] = [];
        });

        /* SORT students by lab number as
        * {
        *   01: [students in this lab],
        *   02: [students in this lab],
        *   03: [students in this lab] ...
        * }
        * */
        requestBody.forEach((student, index) => {
            // get the lab number this student is in
            let labId = student.labId;
            let split = labId.split("_");
            let labNum = Number(split[0]);

            // add the students email to the right key
            studentLabNumberAllocation[labNum].push(student.studentEmailAddress);
        });

        /*
        * for (each list of student emails for a given lab) {
        *     SELECT these students via email and get their PK
        *     Combine with the PK of their lab
        *     INSERT into lab_allocation as [lab_pk, student_pk]
        * }
        * */
        for (const labNumber of Object.keys(studentLabNumberAllocation)) {
            // get the primary key of all of the students allocated to this lab
            const labStudentKeys = await selectStudentsKeys(studentLabNumberAllocation[labNumber]);

            // get the primary key of the lab in question
            const labPrimaryKey = labNumberPrimaryKeyPairs[labNumber];
            // console.log(labNumber, labPrimaryKey, labStudentKeys);

            // combine data into a form compatible with the database schema
            const insertData = labStudentKeys.map((studentKey) => { return [labPrimaryKey, studentKey.stud_unique_id] });
            // insert the data into the database
            await promiseBasedQuery("INSERT IGNORE INTO student_lab_allocation (unit_off_lab_id, stud_unique_id) VALUES ?;", [insertData]);
        }
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    addStudent,
    deleteStudent,
    updateStudent
};