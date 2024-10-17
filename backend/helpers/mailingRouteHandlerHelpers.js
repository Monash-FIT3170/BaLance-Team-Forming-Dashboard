const { promiseBasedQuery } = require("./commonHelpers"); // Import the promise-based MySQL query helper function
const {nodemailer} = require("nodemailer")//new module for email, Import Nodemailer for sending emails

const getAllEmails = async (unitCode,year,period) => {
    /**
     * Function to retrieve distinct student email addresses for a specific unit offering.
     * It performs an SQL query to select all unique email addresses of students
     * enrolled in the specified unit, year, and period.
     *
     * @param {string} unitCode - The code of the unit offering
     * @param {number} year - The year of the unit offering
     * @param {string} period - The period (e.g., semester) of the unit offering
     * @returns {Promise<Array>} - An array of distinct email addresses
     *
     * selects distinct student emails within a unit.
     */

    const studentsEmail = await promiseBasedQuery(
        "SELECT DISTINCT student.email_address " + 
        "FROM student " +
        "INNER JOIN unit_enrolment enrol ON enrol.stud_unique_id = student.stud_unique_id " +
        "INNER JOIN unit_offering unit ON enrol.unit_off_id = unit.unit_off_id " +
        "WHERE unit.unit_code = ? " +
        "AND unit.unit_off_year = ? " + 
        "AND unit.unit_off_period = ? ",
        [unitCode, year, period] // Bind the provided parameters to the query
    );

    const emails = studentsEmail.map(row => row.email_address); //array of emails, // Map the result to an array of email addresses

    return emails // Return the array of email addresses
};

const createEmail = async(sender,receiver,subject,text) => {
    /**
     * Function to create an email object that can be sent using Nodemailer.
     * This function currently sends an email to one recipient, but can be
     * modified for multiple recipients if needed.
     * 
     * @param {string} sender - The email address sending the email
     * @param {string} receiver - The email address of the recipient
     * @param {string} subject - The subject of the email
     * @param {string} text - The content (body) of the email
     * @returns {Object} - An email object ready to be sent
     * 
     * 
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
    getAllEmails, // Export the function to get all email addresses
    createEmail, // Export the function to create an email object
};