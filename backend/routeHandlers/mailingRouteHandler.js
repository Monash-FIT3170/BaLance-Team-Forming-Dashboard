/**
 * This module should only contain functions that handle routes related
 * to the mailing feature
 *
 * */

const {getAllEmails, createEmail,} = require("../helpers/mailingRouteHandlerHelpers");
const {nodemailer} = require("nodemailer")//new nodejs module for email

const getStudentEmails = async (req,res) => {

    const {unitCode, year, period} = req.params;

    const studentEmails = await getAllEmails(unitCode,year,period);

    res.status(200).json(studentEmails);
}


const sendEmails = async (req,res) => {
    const {unitCode,year,period,sender,receiver,subject,text} = req.params; 
    const studentEmails = await getAllEmails(unitCode,year,period); //either this to get student emails or get it from receiver

    const transporter = nodemailer.createTransport({//transporter for email
        host: "host of emails",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "email address",
          pass: "password",
        },
      });

    for(address in studentEmails){
        //sends new email for every student
        transporter.sendMail(createEmail(sender,address,subject,text));
    }
    
    res.status(200).send();

}


module.exports = {
    getStudentEmails,
    sendEmails
};

