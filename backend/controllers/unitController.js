/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

const { spawn } = require('child_process');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const db_connection = require("../config/databaseConfig");
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

// add a new unit to a TAs dashboard
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

// delete a unit and associated relations
const deleteUnit = async function (req, res) {
    const { // get the URL params
        unitCode,
        year,
        period
    } = req.params;

    //delete group allocation
    const group_alloc = await promiseBasedQuery(
        "SELECT ga.group_alloc_id FROM group_allocation ga "+
        "INNER JOIN lab_group lg ON ga.lab_group_id = lg.lab_group_id "+
        "INNER JOIN unit_off_lab l ON l.unit_off_lab_id = lg.unit_off_lab_id "+
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
        "WHERE " +
            "u.unit_code=? " + 
            "AND u.unit_off_year=? " + 
            "AND u.unit_off_period=?;",
        [unitCode, year, period] 
    )


    // create an array
    for (let i = 0;i < group_alloc.length; i++){
        await promiseBasedQuery(
            "DELETE FROM group_allocation " + 
            "WHERE group_alloc_id=?; ",
            [group_alloc[i].group_alloc_id]
        );

    }

    console.log("deleted group allocation")

    // delete lab group
    const lab_group_id = await promiseBasedQuery(
        "SELECT lg.lab_group_id " +
        "FROM lab_group lg " + 
        "INNER JOIN unit_off_lab l ON l.unit_off_lab_id = lg.unit_off_lab_id "+
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
        "WHERE " + 
        "u.unit_code=? " + 
        "AND u.unit_off_year=? " + 
        "AND u.unit_off_period=?;",
        [unitCode, year, period] 
    )
    
    for (let i = 0;i < lab_group_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM lab_group " + 
            "WHERE lab_group_id = ?;",
            [lab_group_id[i].lab_group_id]
        )
        // console.log(lab_group_id[i].lab_group_id)
    }

    console.log("deleted groups")

    //delete student lab allocation
    const stud_lab_alloc_id = await promiseBasedQuery(
        "SELECT sla.stud_lab_alloc_id " +
        "FROM student_lab_allocation sla " +
        "INNER JOIN unit_off_lab l ON l.unit_off_lab_id = sla.unit_off_lab_id "+
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
        "WHERE " +
        "u.unit_code=? " +
        "AND u.unit_off_year=? " +
        "AND u.unit_off_period=?;",
        [unitCode, year, period]
    )
    
    for (let i = 0;i < stud_lab_alloc_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM student_lab_allocation " +
            "WHERE stud_lab_alloc_id = ?;",
            [stud_lab_alloc_id[i].stud_lab_alloc_id]
        )
        // console.log(stud_lab_alloc_id[i].stud_lab_alloc_id)
    }

    console.log("deleted lab allocations")

    //delete unit offering lab
    const unit_off_lab_id = await promiseBasedQuery(
        "SELECT unit_off_lab_id " +
        "FROM unit_off_lab l " +
        "INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id " +
        "WHERE " +
            "u.unit_code= ? " +
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period=?; ",
            [unitCode, year, period]
    )

    for (let i = 0;i < unit_off_lab_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM unit_off_lab " +
            "WHERE unit_off_lab_id = ?; ",
            [unit_off_lab_id[i].unit_off_lab_id]
        )
    }

    console.log("deleted labs");

    // delete enrolments with students in this unit
    await promiseBasedQuery(
        "DELETE FROM unit_enrolment " +
        "WHERE enrolment_id IN ( " +
        "  SELECT subquery.enrolment_id " +
        "  FROM ( " +
        "    SELECT ue.enrolment_id " +
        "    FROM unit_enrolment ue " +
        "    INNER JOIN unit_offering u ON ue.unit_off_id = u.unit_off_id " +
        "    WHERE " +
        "      u.unit_code=? " +
        "      AND u.unit_off_year=? " +
        "      AND u.unit_off_period=? " +
        "  ) AS subquery " +
        ");",
        [unitCode, year, period]
    )

    //DELETE UNIT_OFFERING
    const unit_off_id = await promiseBasedQuery(
        "SELECT u.unit_off_id " +
        "FROM unit_offering u " +
        "WHERE " +
            "u.unit_code= ? " +
            "AND u.unit_off_year=? " +
            "AND u.unit_off_period=?; ",
            [unitCode, year, period]
    )

    for (let i = 0;i < unit_off_id.length; i++){
        await promiseBasedQuery(
            "DELETE FROM unit_offering " +
            "WHERE unit_off_id = ?; ",
            [unit_off_id[i].unit_off_id]
        )
    }

    console.log("deleted unit")

    res.status(200).send();
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

const uploadCustomScript = async (req, res) => {
    // ... (other code)
    const groupSize = req.body.groupSize;
    const variance = req.body.variance;
  
    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).send('file not received.');
    }
      // Read the uploaded file as a string
    try {
        const filePath = uploadedFile.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const pythonFileString = fileContent.toString();
        const students = [{ id: 30722055, name: 'idk', wam: 1, personality: 'DESSC' }, { id: 233122, name: 'lele', wam: 2, personality: 'DSADE' }];

        // const students = await promiseBasedQuery(
        //     'SELECT stud.stud_unique_id, alloc.unit_off_lab_id ' +
        //     'FROM student stud ' +
        //     'INNER JOIN student_lab_allocation alloc ON stud.stud_unique_id=alloc.stud_unique_id ' +
        //     'INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=alloc.unit_off_lab_id ' +
        //     'INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id ' +
        //     'WHERE ' +
        //     '   unit.unit_code=? ' +
        //     '   AND unit.unit_off_year=? ' +
        //     '   AND unit.unit_off_period=? ' +
        //     'ORDER BY unit_off_lab_id;',
        //     [unitCode, year, period]
        // );
        
        //spawn python process with arg
        const pythonArgs = [groupSize, variance, JSON.stringify(students)];
        const pythonProcess = spawn('python3', ['-c', pythonFileString, ...pythonArgs]);
        // Execute the Python process
        let output = '';
  
        await new Promise((resolve, reject) => {
          
            pythonProcess.on('close', async (code) => {
                console.log(`Python script successfully executed with code: ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Failed to run python script: ${code}`));
                }
            });

            pythonProcess.stdout.on('data', async (data) => {
                output += data.toString();
                try {
                    const parsedOutput = JSON.parse(output);
                    console.log(parsedOutput);
                
                    res.json(parsedOutput);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to parse Python output.' });
                }
            });

            pythonProcess.stderr.on('error', (data) => {
                console.error(data.toString());
                res.status(500).json({ error: 'An error occurred while processing the request.' });
            });
        });

        // ... (other code)
    } catch (error) {
        console.error('An unexpected error has occurred:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    } finally { 
                         // unlink the file after finish processing / error occur
                    //
                    // if (save) {
                    //associate req.user.id (sesson auth) / req.jwt (token auth) -> uploadedFile.filename
                    // } else { 
                    //await unlinkAsync(req.file.path);
                    // }
        await unlinkAsync(req.file.path);

    }
};



module.exports = {
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    updateUnit,
    uploadCustomScript
};
