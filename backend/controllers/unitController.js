// TODO controllers to handle requests for unit data

module.exports = {

    deleteUnit: async function (req, res){

        let unitId = req.params.unitId;

        res.send(`${unitId} has been deleted`);

    }


}