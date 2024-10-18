/**
 * This module should only contain functions that handle routes related
 * to the mailing feature
 *
 */

const {
  getAllEmails,// Function to retrieve all student emails based on provided criteria
  createEmail,// Function to create a new email (not used in this code)
} = require("../helpers/mailingRouteHandlerHelpers");// Importing helper functions for email handling
const nodemailer = require("nodemailer");// Importing nodemailer for sending emails

require("dotenv").config();// Loading environment variables from a .env file

// Function to handle requests for retrieving student emails
const getStudentEmails = async (req, res) => {
  /**
   * Retrieves student emails based on the provided unit code, year, and period.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.unitCode - The unit code to filter emails.
   * @param {number} req.params.year - The year to filter emails.
   * @param {string} req.params.period - The period to filter emails.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  const { unitCode, year, period } = req.params;// Destructuring parameters from the request object

  const studentEmails = await getAllEmails(unitCode, year, period);// Call the helper function to get all student emails based on provided parameters

  res.status(200).json(studentEmails);// Send a JSON response with the retrieved student emails and a status code of 200 (OK)
};

// Function to handle requests for sending emails to students
const sendEmails = async (req, res) => {
  /**
   * Sends emails to students with a link to a personality form for team formation.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.unitCode - The unit code for the course.
   * @param {number} req.params.year - The year of the course.
   * @param {string} req.params.period - The period of the course.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.url - The URL link to the personality form.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - A promise that resolves when the emails have been sent.
   */
  const { unitCode, year, period } = req.params;// Destructuring parameters from the request object
  const link = req.body;// Extract the link object from the request body
  console.log(link);// Log the link for debugging purposes

  // either this to get student emails or get it from receiver
  const studentEmails = await getAllEmails(unitCode, year, period); // Retrieve student emails based on the provided unit code, year, and period

  const transporter = nodemailer.createTransport({// Create a transporter object using nodemailer for sending emails
    // transporter for email
    service: "gmail",
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.EMAIL_PASSWORD, // google app password
    },
  });
  // sends new email for every student

  emailHTML = `
      <h1><span style="color: #003366;">BaLance Team Forming Dashboard</span></h1>
      <p>&nbsp;</p>
      <p><span style="color: #000000;">You are receiving this email because your teacher/lecturer has elected you to fill out our personality form for the purposes of forming teams at your school/university for the unit "<strong>${unitCode}, ${period}, ${year}</strong>".<br /><br /></span></p>
      <p>&nbsp;</p>
      <p>Please fill out the google form linked <a title="google form link" href="${link.url}">here</a>, or copy and paste the link below<br />${link.url}</p>
      <p><br /><br /><em>Note: For the purposes of team formation, the information you provide in the form above will be saved within our database. The BaLance Team agrees to not redistribute, misrepresent, or alter any user information entered.</em></p>
      <p>&nbsp;</p>
      <p>Thank you!</p>
      <p><em>The BaLance Team</em></p>
      <p>&nbsp;</p>
      <p><em>BaLance is an open-source team forming project for use in schools and universities. </em><em>For</em><em> more information on the project, click <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard">here</a>.</em></p>
      <h1><img src="https://balance-frontend-production.up.railway.app/src/assets/logo_separated.png" alt="" /></h1>
      `;

  const info = await transporter.sendMail({// Send the email to all student emails retrieved
    from: `"BaLanceApp" <${process.env.SERVICE_EMAIL}>`, // sender address
    to: studentEmails.join(", "), // list of receivers
    subject: `${unitCode} - Personality Form Submission`, // Subject line
    html: `${emailHTML}`, // html body
  });

  res.status(200).send();// Send a response back indicating that the email has been sent successfully
};

module.exports = {// Export the functions for use in other modules
  getStudentEmails,
  sendEmails,
};