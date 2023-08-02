/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

const db_connection = require('../db_connection');
const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

// gets all units for a user
const getAllUnits = async (req, res) => {
    db_connection.query(
        'SELECT * FROM unit_offering;',
        (err, results, fields) => {
            if(err) { console.error(err.stack); }
            else {
                console.log(results);
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

    const [unitData] = promiseBasedQuery(
        'SELECT * ' +
        'FROM unit_offering ' +
        'WHERE unit_code=? AND unit_off_year=? AND unit_off_period=?;',
        [unitCode, Number(year), period]
    );

    console.log(unitData);
    res.status(200).json(unitData);
}

const addUnit = async (req, res) => {
    // get the req body
    const newUnit = {
        unitCode,
        unitName,
        year,
        period,
    } = req.body

    try {
        // note: unique id has auto_increment enabled thus not provided
        const insertQueryResult = await promiseBasedQuery(
            'INSERT INTO unit_offering ' +
            '(unit_code, unit_name, unit_off_year, unit_off_period, enrolment_count) ' +
            'VALUES (?, ?, ?, ?, ?);',
            [unitCode, unitName, Number(year), period, 0]
        )

        console.log(`Successfully added new unit ${JSON.stringify(newUnit)}`);
        res.status(200).json(newUnit);

    } catch(error) {
        console.log(error.code);

        let errorMsg;
        switch (error.code) {
            case 'ER_DUP_ENTRY':
                errorMsg = `Error: the unit offering ${unitCode}, ${year}, ${period} already exists`;
                break;
            case 'ER_BAD_FIELD_ERROR':
                errorMsg = `Error: year ${year} is not a number`;
                break;
            default:
                errorMsg = "Error: something went wrong :(";
        }
        res.status(400).send(errorMsg);
    }
}

// TODO delete associated enrolments, labs etc
deleteUnit = async function (req, res) {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params;


    const group_alloc_id = await promiseBasedQuery(
        "SELECT ga.group_alloc_id " + 
        "FROM group_allocation ga " + 
        "INNER JOIN lab_group lg ON ga.lab_group_id = lg.lab_group_id " + 
        "INNER JOIN unit_off_lab l ON l.unit_off_lab_id = lg.unit_off_lab_id "+
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " + 
        "WHERE " + 
            "u.unit_code= ? " + 
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period='?; "
            [unitCode, year, period] 
    )
    
    
    await promisedBasedQuery(
        "DELETE FROM group_allocation ga " + 
        "WHERE ga.group_alloc_id  = ?; "
        [group_alloc_id]
    );

    const lab_group_id = await promisedBasedQuery(
        "SELECT lg.lab_group_id " + 
        "FROM lab_group lg " + 
         
        "INNER JOIN unit_off_lab l ON l.unit_off_lab_id = lg.unit_off_lab_id "+
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " + 
        "WHERE " + 
            "u.unit_code= ? " + 
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period='?; "
            [unitCode, year, period] 
    )

    await promisedBasedQuery(
        "DELETE FROM lab_group lg " + 
        "WHERE lg.lab_group_id = ?; "
        [lab_group_id]
    )

    const unit_off_lab_id = await promiseBasedQuery(
        "SELECT unit_off_lab_id " + 
        "FROM unit_off_lab l " + 
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " + 
        "WHERE " + 
            "u.unit_code= ? " + 
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period='?; "
            [unitCode, year, period] 
    )

    await promisedBasedQuery(
        "DELETE FROM unit_off_lab u " + 
        "WHERE u.lab_group_id = ?; "
        [unit_off_lab_id]
    )

    const unit_off_id = await promiseBasedQuery(
        "SELECT unit_off_lab_id " + 
        "FROM unit_off_lab l " + 
        "WHERE " + 
            "u.unit_code= ? " + 
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period='?; "
            [unitCode, year, period]
    )

    await promisedBasedQuery(
        "DELETE FROM unit_offering u " + 
        "WHERE u.unit_off_id = ?; "
        [unit_off_id]
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
