/**
 * A module containing helper functions specifically used to implement
 * studentController.js controller functions
 *
 * */

const {promiseBasedQuery} = require("./commonHelpers");

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

const insertStudentEnrolment = async (studentKeys, unitOffId) => {
    /**
     * adds enrolment data given an array of student keys and a unit offering id,
     */
    try {
        const enrolmentInsertData = studentKeys.map((student) => {
            return [student.stud_unique_id, unitOffId]
        })

        return promiseBasedQuery(
            'INSERT IGNORE INTO unit_enrolment ' +
            '(stud_unique_id, unit_off_id) VALUES ?;',
            [enrolmentInsertData]
        )
    } catch(error) {
        throw error
    }
}

const insertUnitOffLabs = async (requestBody, unitOffId) => {
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
            let lab = [unitOffId, i];
            labInsertData.push(lab);
        }

        return promiseBasedQuery(
            'INSERT IGNORE INTO unit_off_lab (unit_off_id, lab_number) ' +
            'VALUES ?;',
            [labInsertData]
        )
    } catch(error) {
        throw error
    }
}

const insertStudentLabAllocations = async (requestBody, unitOffId) => {
    try {
        /* SELECT labs and create a dictionary of form
        * {
        *   01: pk for lab 01,
        *   02: pk for lab 02,
        *   03: pk for lab 03 ...
        * }
        * */
        const unit_off_labs = await promiseBasedQuery('SELECT * FROM unit_off_lab WHERE unit_off_id=?;', [unitOffId]);
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
            const insertData = labStudentKeys.map((studentKey) => {
                return [labPrimaryKey, studentKey.stud_unique_id]
            });
            // insert the data into the database
            await promiseBasedQuery(
                "INSERT IGNORE INTO student_lab_allocation " +
                "(unit_off_lab_id, stud_unique_id) VALUES ?;",
                [insertData]
            );
        }
    } catch(error) {
        throw error;
    }
}

module.exports = {
    insertStudents,
    selectStudentsKeys,
    insertStudentEnrolment,
    insertUnitOffLabs,
    insertStudentLabAllocations
}