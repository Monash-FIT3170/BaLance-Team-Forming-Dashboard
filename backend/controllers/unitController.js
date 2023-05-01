/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

const fs = require('fs');

// gets all units for a user
getAllUnits = async function (req, res){
    // open units.json and read
    console.log('reaching database');
    const file = './db/units.json';

    // read file
    fs.readFile(file, 'utf-8', (err, unitData) => {
        console.log("Getting all units")
        console.log(unitData)

        // send JSON data from file
        res.send(unitData);
    });
}

deleteUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been deleted`);
}

updateUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been updated`);
}

module.exports = {
    getAllUnits,
    deleteUnit,
    updateUnit
}