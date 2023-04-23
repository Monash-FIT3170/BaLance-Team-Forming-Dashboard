/**
 * A module contianing controller functions for routes related
 * to unit data.
 *
 * */

// TODO controllers to handle requests for unit data
deleteUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been deleted`);
},

updateUnit = async function (req, res){
    let unitId = req.params.unitId;
    res.send(`${unitId} has been updated`);
}



module.exports = {




}