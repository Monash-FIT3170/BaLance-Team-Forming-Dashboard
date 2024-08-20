/**
 * This module should only contain functions that handle routes related
 * to the mailing feature
 *
 * */

const {getAllEmails,} = require("../helpers/mailingRouteHandlerHelpers");

const getStudentEmails = async (req,res) => {

    const {unitCode, year, period} = req.params;

    const studentEmails = await getAllEmails(unitCode,year,period);

    res.status(200).json(studentEmails);
}

module.exports = {
    getStudentEmails
};

