const { promiseBasedQuery } = require("./commonHelpers");
const {nodemailer} = require("nodemailer")//new module for email

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

    const emails = studentsEmail.map(row => row.email_address); //array of emails

    return emails
};

const createEmail = async(sender,receiver,subject,text) => {
    /**
     * creates a email to send. currently meant to send to one email. can be changed for multiple receivers.
     */

    const email = {
        from:sender, //the email which is sending the emails
        to:receiver, //the emails which will recieve the email
        subject:subject,//subject of the email
        text:text//the text of the email i.e. the google form link
    }

    return email
}

module.exports = {
    getAllEmails,
    createEmail,
};