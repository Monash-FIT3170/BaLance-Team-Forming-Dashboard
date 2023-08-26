/**
 * A module containing controller functions for routes related
 * to student data.
 *
 * */

const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

const {
    insertStudents,
    selectStudentsKeys,
    insertStudentEnrolment,
    insertUnitOffLabs,
    insertStudentLabAllocations
} = require("../helpers/studentControllerHelpers");

/* CONTROLLER FUNCTIONS */
// gets all students for a unit
const getAllStudents = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params

    const studentsData = await promiseBasedQuery(
        "SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val " +
        "FROM student stud " +
        "inner join unit_enrolment ue on ue.stud_unique_id=stud.stud_unique_id " +
        "inner join unit_offering unit on ue.unit_off_id=unit.unit_off_id " +
        "WHERE unit.unit_code=? " +
        "AND unit.unit_off_year=? " +
        "AND unit.unit_off_period=?",
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
    const unitOffId = await selectUnitOffKey(unitCode, year, period);
    await insertStudentEnrolment(studentKeys, unitOffId);

    /* CREATE THE LABS ASSOCIATED WITH THE UNIT ENROLMENT AND ALLOCATE THE STUDENTS */
    await insertUnitOffLabs(requestBody, unitOffId); // ensure lab no.s don't repeat in units
    await insertStudentLabAllocations(requestBody, unitOffId);

    res.status(200).send();
}

// delete a single student from the unit
const deleteStudentEnrolment = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;

     // delete group allocations
     const group_alloc_id = await promiseBasedQuery(
     "SELECT group_alloc_id " +
     "FROM group_allocation ga " +
     "INNER JOIN lab_group lg ON lg.lab_group_id=ga.lab_group_id " +
     "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=lg.unit_off_lab_id " +
     "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
     "INNER JOIN student s ON ga.stud_unique_id=s.stud_unique_id " +
     "WHERE " +
        "u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=? " +
        "AND s.student_id=?;",
        [unitCode, year, period, studentId]
     );

     for (let i = 0;i < group_alloc_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE group_alloc_id=?;",
            [group_alloc_id[i].group_alloc_id]
        )
     }

    // delete lab allocation
    const stud_lab_alloc_id = await promiseBasedQuery(
    "SELECT stud_lab_alloc_id FROM student_lab_allocation sa " +
    "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=sa.unit_off_lab_id " +
    "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
    "INNER JOIN student s ON s.stud_unique_id=sa.stud_unique_id " +
    "WHERE " +
        "u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=? " +
        "AND s.student_id=?; ",
        [unitCode, year, period, studentId]
    );

    for (let i = 0;i < stud_lab_alloc_id.length; i++){
        await promiseBasedQuery(
        "DELETE FROM student_lab_allocation " +
        "WHERE stud_lab_alloc_id=?; ",
            [stud_lab_alloc_id[i].stud_lab_alloc_id]
        )
    }

    // Delete the student unit enrolment
    const enrolment_id = await promiseBasedQuery(
        "SELECT ue.enrolment_id FROM unit_enrolment ue "+
        "INNER JOIN unit_offering u ON ue.unit_off_id = u.unit_off_id "+
        "INNER JOIN student s ON s.stud_unique_id = ue.stud_unique_id " +
        "WHERE " +
            "u.unit_code=? " +
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period=? " +
            "AND s.student_id=?;",
        [unitCode, year, period, studentId]
    )

    for (let i = 0;i < enrolment_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM unit_enrolment " +
            "WHERE enrolment_id=?; ",
            [enrolment_id[i].enrolment_id]
        );
    }

    const stud_unique_id = await promiseBasedQuery(
        "SELECT s.stud_unique_id " +
        "FROM student s " +
        "WHERE " +
            "s.student_id =?; ",
            [studentId]
    )

    // delete from lab allocation
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM student_lab_allocation " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }

    // delete from group allocation
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }

    // delete from enrolment
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM unit_enrolment " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }

    // DELETE STUDENT
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM student " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }

    // Respond with success message
    res.status(200).send({ message: "Student successfully deleted from specified unit"});
}

// delete a single student from group
const deleteStudentGroupAlloc = async (req, res) => {
    const { // get the URL params
        unitCode,
        year,
        period,
        studentId
    } = req.params;

     // delete group allocations
     const group_alloc_id = await promiseBasedQuery(
     "SELECT group_alloc_id " +
     "FROM group_allocation ga " +
     "INNER JOIN lab_group lg ON lg.lab_group_id=ga.lab_group_id " +
     "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=lg.unit_off_lab_id " +
     "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
     "INNER JOIN student s ON ga.stud_unique_id=s.stud_unique_id " +
     "WHERE " +
        "u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=? " +
        "AND s.student_id=?;",
        [unitCode, year, period, studentId]
     );

     for (let i = 0;i < group_alloc_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE group_alloc_id=?;",
            [group_alloc_id[i].group_alloc_id]
        )
     }

    // delete lab allocation
    const stud_lab_alloc_id = await promiseBasedQuery(
    "SELECT stud_lab_alloc_id FROM student_lab_allocation sa " +
    "INNER JOIN unit_off_lab ul ON ul.unit_off_lab_id=sa.unit_off_lab_id " +
    "INNER JOIN unit_offering u ON u.unit_off_id=ul.unit_off_id " +
    "INNER JOIN student s ON s.stud_unique_id=sa.stud_unique_id " +
    "WHERE " +
        "u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=? " +
        "AND s.student_id=?; ",
        [unitCode, year, period, studentId]
    );

    for (let i = 0;i < stud_lab_alloc_id.length; i++){
        await promiseBasedQuery(
        "DELETE FROM student_lab_allocation " +
        "WHERE stud_lab_alloc_id=?; ",
            [stud_lab_alloc_id[i].stud_lab_alloc_id]
        )
    }

    const stud_unique_id = await promiseBasedQuery(
        "SELECT s.stud_unique_id " +
        "FROM student s " +
        "WHERE " +
            "s.student_id =?; ",
            [studentId]
    )
    // delete from lab allocation
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM student_lab_allocation " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }

    // delete from group allocation
    for (let i = 0;i < stud_unique_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM group_allocation " +
            "WHERE stud_unique_id = ?; ",
            [stud_unique_id[i].stud_unique_id]
        )
    }
}

// update a student's details
const updateStudent = async (req, res) => {
    const { studentId } = req.params // get the URL params
    const updateStudentDetails = req.body

    // error handling for unexpected issues
    try {
        const updateQuery =
            "UPDATE student " +
            "SET preferred_name=?, last_name=?, email_address=?, wam_val=? " +
            "WHERE student_id=? ";
        // updated values for the student
        const { preferred_name, last_name, email_address, wam_val } = updateStudentDetails;

        await promiseBasedQuery(updateQuery, [preferred_name, last_name, email_address, wam_val, studentId]);
        // Respond with success message
        res.status(200).send({ message: "Student details updated"});

    } catch (err) {
        // Respond with error message
        console.log("Error while updating student ", err);
        res.status(500).send({ error: "Error occurred while updating student details" })
    }
}

const addStudentBelbin = async (req, res) => {
    const {unitCode, year, period} = req.params
    const students = req.body;

        // error handling for unexpected issues

        for(let i = 0; i < students.length; i++){

            let student = students[i];
            
            try {
                const updateQuery =
                    "insert into personality_test_attempt (test_type, stud_unique_id, unit_off_id) " +
                    "values ('belbin', (select stud_unique_id from student where student_id like ?), (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?) ) " ;
                // updated values for the student
        
                await promiseBasedQuery(updateQuery, [student.studentId, unitCode, year, period]);
                // Respond with success message
                //res.status(200).send({ message: "Student details updated"});
        
            } catch (err) {
                // Respond with error message
                console.log("Error while updating student ", err);
                //res.status(500).send({ error: "Error occurred while updating student details" })
            }
        }

        for(let i = 0; i < students.length; i++){

            let student = students[i];

            try {

                const updateQuery =
                    "insert into belbin_result (personality_test_attempt, belbin_type) " +
                    "values ((select test_attempt_id from personality_test_attempt where stud_unique_id like (select stud_unique_id from student where student_id like ? and test_type = 'belbin') and unit_off_id like (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?)), ?)" ;
                // updated values for the student
        
                await promiseBasedQuery(updateQuery, [student.studentId, unitCode, year, period, student.belbinType]);
                // Respond with success message
        
            } catch (err) {
                // Respond with error message
                console.log("Error while updating student ", err);
            }

        }
}

const addStudentEffort = async (req, res) => {
    const {unitCode, year, period} = req.params
    const students = req.body;

    for(let i = 0; i < students.length; i++){

        let student = students[i];
        
        try {
            const updateQuery =
                "insert into personality_test_attempt (test_type, stud_unique_id, unit_off_id) " +
                "values ('effort', (select stud_unique_id from student where student_id like ?), (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?) ) " ;
            // updated values for the student
    
            await promiseBasedQuery(updateQuery, [student.studentId, unitCode, year, period]);
            // Respond with success message
            //res.status(200).send({ message: "Student details updated"});
    
        } catch (err) {
            // Respond with error message
            console.log("Error while updating student ", err);
            //res.status(500).send({ error: "Error occurred while updating student details" })
        }
    }

    for(let i = 0; i < students.length; i++){

        let student = students[i];

        try {

            const updateQuery =
                "insert into effort_result (personality_test_attempt, time_commitment_hrs, assignment_avg, marks_per_hour) " +
                "values ((select test_attempt_id from personality_test_attempt where stud_unique_id like (select stud_unique_id from student where student_id like ? ) and unit_off_id like (select unit_off_id from unit_offering where unit_code like ? and unit_off_year like ? and lower(unit_off_period) like ?)), ?, ?, ?)" ;
            // updated values for the student
    
            await promiseBasedQuery(updateQuery, [student.studentId, unitCode, year, period, student.hours, student.averageMark, student.marksPerHour]);
            // Respond with success message
    
        } catch (err) {
            // Respond with error message
            console.log("Error while updating student ", err);
        }

    }
}

module.exports = {
    getAllStudents,
    getStudent,
    addAllStudents,
    deleteStudentEnrolment,
    deleteStudentGroupAlloc,
    updateStudent,
    addStudentBelbin,
    addStudentEffort 
};