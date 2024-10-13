/**
 * This module should only contain functions that handle routes related
 * to the mailing feature
 *
 * */

const { getAllEmails, createEmail, } = require("../helpers/mailingRouteHandlerHelpers");
const nodemailer = require('nodemailer');

require('dotenv').config();

const getStudentEmails = async (req,res) => {

    const {unitCode, year, period} = req.params;

    const studentEmails = await getAllEmails(unitCode,year,period);

    res.status(200).json(studentEmails);
}


const sendEmails = async (req,res) => {
    const {unitCode,year,period} = req.params; 
    const link = req.body;
    console.log(link);
    
    const studentEmails = await getAllEmails(unitCode,year,period); //either this to get student emails or get it from receiver

    const transporter = nodemailer.createTransport({//transporter for email
        service: 'gmail',
        auth: {
          user: process.env.SERVICE_EMAIL,
          pass: process.env.EMAIL_PASSWORD, //google app password
        },
      });
      //sends new email for every student

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
      `

      const info = await transporter.sendMail({
        from: `"BaLanceApp" <${process.env.SERVICE_EMAIL}>`, // sender address
        to: studentEmails.join(", "), // list of receivers
        subject: `${unitCode} - Personality Form Submission`, // Subject line
        html: `${emailHTML}`, // html body
      });
    
    res.status(200).send();
}


module.exports = {
    getStudentEmails,
    sendEmails
};

