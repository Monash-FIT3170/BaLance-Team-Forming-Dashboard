// TODO controllers to handle requests for groups data

// TODO controllers to handle requests for unit data

module.exports = {

    getAllGroups: async function (req, res){

        let unitId = req.params.unitId;

        res.send(`Groups from ${unitId}`);

    }


}