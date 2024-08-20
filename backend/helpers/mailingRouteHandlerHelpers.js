const { promiseBasedQuery } = require("./commonHelpers");

const getAllEmails = async (unitCode,year,period) => {
    /**
     * selects distinct student emails within a unit.
     */

    const studentsEmail = await promiseBasedQuery(
        "SELECT DISTINCT student.email_address" +
        "FROM student" +
        "INNER JOIN student_lab_allocation l_alloc ON l_alloc.stud_unique_id= student.stud_unique_id" +
        "INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id = l_alloc.stud_unique_id" +
        "INNER JOIN unit_offering unit ON unit.unit_off_id = lab.unit_off_id" +
        "WHERE unit.unit_code = ?" +
        "AND unit.unit_off_year = ?" + 
        "AND unit.unit_off_period = ?",
        [unitCode, year, period]
    );

    const emails = studentsEmail.map(row => row.email_address);

    return emails
};

module.exports = {
    getAllEmails,
};