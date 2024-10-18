const { promiseBasedQuery } = require("./commonHelpers");

const insertStudents = async (studentInsertData) => {
    /**
     * Inserts student data into the 'student' table.
     * Uses INSERT IGNORE to avoid inserting duplicates (based on a unique key, e.g., email or student ID).
     * 
     * @param {Array} studentInsertData - An array of arrays where each inner array represents a student row
     * @returns {Promise} - The result of the insertion query
     *
     * 
     * given a list of student data in the form of an array, uploads the data
     * taking into consideration if a student already exists on the database or not
     */
    try {
        return promiseBasedQuery(
            "INSERT IGNORE INTO student " +
            "(student_id, last_name, preferred_name, email_address, wam_val, gender) " +
            "VALUES ?;",
            [studentInsertData]
        );
    } catch (error) {
        throw error;
    }
};

const selectStudentsKeys = async (studentEmails) => {
    /**
     * Retrieves the primary keys (stud_unique_id) for a list of student email addresses.
     * 
     * @param {Array} studentEmails - An array of student email addresses
     * @returns {Promise<Array>} - Array of student primary keys (stud_unique_id)
     *
     * 
     * obtains the list of primary keys for the students associated with the list of emails provided
     * result is used to form enrolment data for a unit offering
     */
    try {
        return promiseBasedQuery("SELECT stud_unique_id FROM student WHERE email_address IN ?;", [[studentEmails]]);
    } catch (error) {
        throw error;
    }
};

const insertStudentEnrolment = async (studentKeys, unitOffId) => {
    /**
     * Inserts student enrollment data into 'unit_enrolment' table.
     * Associates each student (by their stud_unique_id) with a unit offering (unit_off_id).
     * 
     * @param {Array} studentKeys - Array of student primary keys (stud_unique_id)
     * @param {number} unitOffId - The primary key of the unit offering (unit_off_id)
     * @returns {Promise} - The result of the insertion query
     *
     * 
     * adds enrolment data given an array of student keys and a unit offering id,
     */
    try {
        const enrolmentInsertData = studentKeys.map((student) => {
            return [student.stud_unique_id, unitOffId];
        });
        return promiseBasedQuery("INSERT IGNORE INTO unit_enrolment " + "(stud_unique_id, unit_off_id) VALUES ?;", [
            enrolmentInsertData,
        ]);
    } catch (error) {
        throw error;
    }
};

const insertUnitOffLabs = async (requestBody, unitOffId) => {
    /**
     * Determines the number of labs based on the students' lab codes and inserts the labs for the unit offering.
     * 
     * @param {Array} requestBody - Array of student objects, each containing a labCode attribute
     * @param {number} unitOffId - The primary key of the unit offering (unit_off_id)
     * @returns {Promise} - The result of the insertion query
     *
     * 
     * Given a list of students from a request body, determines the number of labs
     * in an offering and creates them in the database
     */
    try {
        // get the highest lab number N and create N labs for this unit
        // where labs are in the format n_activity where n is the lab no.
        let numLabs = 0;
        for (student of requestBody) {
            let labId = student.labCode;
            let split = labId.split("_");
            let labNum = Number(split[0]);
            numLabs = labNum > numLabs ? labNum : numLabs;
        }
        
        // Prepare the lab data for insertion
        // formulate data into the desired format: [unit_off_id, lab_number]
        let labInsertData = [];
        for (let i = 1; i <= numLabs; i++) {
            let lab = [unitOffId, i];
            labInsertData.push(lab);
        }

        return promiseBasedQuery("INSERT IGNORE INTO unit_off_lab (unit_off_id, lab_number) " + "VALUES ?;", [
          labInsertData,
        ]);
    } catch (error) {
        throw error;
    }
};

const insertStudentLabAllocations = async (requestBody, unitOffId) => {
    /**
     * Allocates students to labs based on their lab codes.
     * This function inserts data into the 'student_lab_allocation' table.
     * 
     * @param {Array} requestBody - Array of student objects, each containing an email and labCode
     * @param {number} unitOffId - The primary key of the unit offering (unit_off_id)
     * @returns {Promise} - The result of the insertion query
     */
    try {
        // Fetch the labs for the unit offering and map them by lab_number
        /* SELECT labs and create a dictionary of form
         * {
         *   01: pk for lab 01,
         *   02: pk for lab 02,
         *   03: pk for lab 03 ...
         * }
         * */
        const unit_off_labs = await promiseBasedQuery("SELECT * FROM unit_off_lab WHERE unit_off_id=?;", [unitOffId]);
        const labNumberPrimaryKeyPairs = {};
        const studentLabNumberAllocation = {};
        unit_off_labs.forEach((lab, index) => {
            labNumberPrimaryKeyPairs[lab.lab_number] = lab.unit_off_lab_id;
            studentLabNumberAllocation[lab.lab_number] = [];
        });

        // Build mapping of lab_number to lab's primary key
        /* SORT students by lab number as
         * {
         *   01: [students in this lab],
         *   02: [students in this lab],
         *   03: [students in this lab] ...
         * }
         * */
        requestBody.forEach((student, index) => {
            // get the lab number this student is in
            let labId = student.labCode;
            let split = labId.split("_");
            let labNum = Number(split[0]);

            // add the students email to the right key
            studentLabNumberAllocation[labNum].push(student.email);
        });

        // Organize students by their lab number
        /*
         * for (each list of student emails for a given lab) {
         *     SELECT these students via email and get their PK
         *     Combine with the PK of their lab
         *     INSERT into lab_allocation as [lab_pk, student_pk]
         * }
         * */
        // For each lab, allocate students by inserting into the database
        for (const labNumber of Object.keys(studentLabNumberAllocation)) {
            // get the primary key of all of the students allocated to this lab
            const labStudentKeys = await selectStudentsKeys(studentLabNumberAllocation[labNumber]);

            // get the primary key of the lab in question
            const labPrimaryKey = labNumberPrimaryKeyPairs[labNumber];

            // combine data into a form compatible with the database schema
            const insertData = labStudentKeys.map((studentKey) => {
                return [labPrimaryKey, studentKey.stud_unique_id];
            });

            // insert the data into the database
            await promiseBasedQuery(
                "INSERT IGNORE INTO student_lab_allocation " + "(unit_off_lab_id, stud_unique_id) VALUES ?;",
                [insertData]
            );
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertStudents,
    selectStudentsKeys,
    insertStudentEnrolment,
    insertUnitOffLabs,
    insertStudentLabAllocations,
};
