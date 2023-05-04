/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

const fs = require('fs');

// gets all units for a user
const getAllUnits = async (req, res) => {
    // open units.json and read
    const file = './db/units.json';

    // read file
    fs.readFile(file, 'utf-8', (err, unitsData) => {
        // convert to JSON
        let units = JSON.parse(unitsData);

        // filter data to get desired attributes
        let resData = units.map((unit) => {
            return {
                unitCode: unit["unitCode"],
                unitFaculty: unit["unitFaculty"]
            }
        })

        // send to frontend
        res.status(200).send(resData);
    });
}

// get a single unit for a user
const getUnit = async (req, res) => {
    // open units.json and read
    const file = './db/units.json';
    const { unitId } = req.params;

    // read file
    fs.readFile(file, 'utf-8', (err, unitsData) => {
        const units = JSON.parse(unitsData);

        // extract the desired unit from the list of units
        const unit = units.filter((unit) => {
            return unit.unitCode === unitId;
        })[0];

        // filter desired fields from the unit
        let resData = { };
        const resFields = ["unitCode", "unitFaculty", "labs", "teachers"];
        for(const field in unit) {
            if(resFields.includes(field)) {
                resData[field] = unit[field];
            }
        }

        // send to frontend
        res.status(200).send(resData);
    });
}

const addUnit = async (req, res) => {
    // get the req body
    const newUnit = {
        unitCode,
        unitFaculty,
        labs,
        teachers
    } = req.body
    const file = './db/units.json';

    // get the items from the file

    // read file
    fs.readFile(file, 'utf-8', (err, unitsData) => {
        // append the new unit to the file
        const units = JSON.parse(unitsData);
        units.push(newUnit);

        // write to the file
        fs.writeFile(file, JSON.stringify(units), (err) => {
            console.log(err);
        });

        // send response status
        res.status(200).send(newUnit);
    });
}

deleteUnit = async function (req, res) {
    const { unitId } = req.params;
    const file = './db/units.json';

    // get the items from the file

    // read file
    fs.readFile(file, 'utf-8', (err, unitsData) => {
        // append the new unit to the file
        const units = JSON.parse(unitsData);

        // filter the units
        const remainingUnits = units.filter((unit) => {
            return unit.unitCode !== unitId;
        });
        const deletedUnit = units.filter((unit) => {
            return unit.unitCode === unitId;
        });

        // write to the file
        fs.writeFile(file, JSON.stringify(remainingUnits), (err) => {
            console.log(err);
        });

        // send response status
        res.status(200).send(deletedUnit);
    });
}

updateUnit = async function (req, res){
    const { unitId } = req.params;
    res.send(`${unitId} has been updated`);

    // Have a look at the above code for adding a unit
    // Read the units.json file and store in a variable
    // Update the unit with unitCode matchin unitId
    // write this to the units.json file
    // send a res status of 200 and send the unit updated

}

module.exports = {
    getAllUnits,
    getUnit,
    addUnit,
    deleteUnit,
    updateUnit
};