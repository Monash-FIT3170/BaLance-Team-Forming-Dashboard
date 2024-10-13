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
      const info = await transporter.sendMail({
        from: `"BaLanceApp" <${process.env.SERVICE_EMAIL}>`, // sender address
        to: studentEmails.join(", "), // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
    res.status(200).send();
}


module.exports = {
    getStudentEmails,
    sendEmails
};

