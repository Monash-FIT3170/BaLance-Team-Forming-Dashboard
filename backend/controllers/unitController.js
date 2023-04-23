/**
 * A module containing controller functions for routes related
 * to unit data.
 *
 * */

getAllUnits = async function (req, res){
    console.log("Getting all units")
}


deleteUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been deleted`);
},

updateUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been updated`);
}

module.exports = {
    getAllUnits,
    deleteUnit,
    updateUnit
}