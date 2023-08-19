/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

const db_connection = require('../db_connection');

// gets all units for a user
const getAllUnits = async (req, res) => {
    db_connection.query(
        'SELECT * FROM unit_offering;',
        (err, results, fields) => {
            if(err) { console.error(err.stack); }
            else {
                res.status(200).json(results);
            }
        }
    )
}

// get a single unit for a user
const getUnit = async (req, res) => {
    const { // get the URL params for DB querying
        unitCode,
        year,
        period
    } = req.params

    db_connection.query(
        'SELECT * ' +
        'FROM unit_offering ' +
        'WHERE unit_code=? AND unit_off_year=? AND unit_off_period=?;',
        [unitCode, Number(year), period],
        (err, results, fields) => {
            if(err) { console.error(err.stack); }
            else {
                [unitData] = results; // extract unit object from array
                console.log(unitData);
                res.status(200).json(unitData);
            }
        }
    )
}

const addUnit = async (req, res) => {
    // get the req body
    const newUnit = {
        unitCode,
        unitName,
        year,
        period,
    } = req.body

    console.log(newUnit)

    // note: unique id has auto_increment enabled thus not provided
    db_connection.query(
        'INSERT INTO unit_offering ' +
        '(unit_code, unit_name, unit_off_year, unit_off_period, enrolment_count) ' +
        'VALUES (?, ?, ?, ?);',
        [unitCode, unitName, Number(year), period, 0],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else {
                console.log(results);
                res.status(200).json(results);
            }
        }
    )
}

// TODO delete associated enrolments, labs etc
deleteUnit = async function (req, res) {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params;

    db_connection.query(
        'DELETE FROM unit_offering WHERE ' +
        'unit_code=? AND unit_off_year=? AND unit_off_period=?;',
        [unitCode, Number(year), period],
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else {
                console.log(results);
                res.status(200).json(results);
            }
        }
    )
}

// FIXME SQL query not working
updateUnit = async function (req, res){
    const urlParamValues = { // URL params
        unitCode,
        year,
        period
    } = req.params;
    const newValues = req.body;

    // contains the right format for referencing table attributes
    const table_attributes = {
        unitCode: "unit_code",
        unitName: "unit_name",
        year: "unit_off_year",
        period: "unit_off_period"
    };

    // building the query string from scratch
    let query_string = 'UPDATE unit_offering SET ';
    let query_params = [];
    for (const key in newValues) { // add where clauses only for columns specified in req.body
        query_string += `${table_attributes[key]}=?, `;
        query_params.push(newValues[key]);
    }
    query_string += `WHERE unit_code=? AND unit_off_year=? AND unit_off_period=?;`;
    query_params = [...query_params, ...Object.values(urlParamValues)];

    console.log(query_string);
    console.log(query_params);

    db_connection.query(
        query_string,
        query_params,
        (err, results, fields) => {
            if(err) { console.log(err.stack); }
            else {
                console.log(results);
                res.status(200).json(results);
            }
        }
    )
}

module.exports = {
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    updateUnit
};
