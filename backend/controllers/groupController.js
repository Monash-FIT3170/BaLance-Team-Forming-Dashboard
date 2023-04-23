// TODO controller functions to handle requests for groups data

getAllGroups: async function (req, res){

    let unitId = req.params.unitId;

    res.send(`Groups from ${unitId}`);

}

// get a single group from a unit
const getGroup = async (req, res) => {
    res.status(200).json({
        group: "group 1"
    })
}

// add a new group to a unit
const addGroup = async (req, res) => {
    res.status(200).json({
        group: "group added"
    })
}

// delete a specific group from a unit
const deleteGroup = async (req, res) => {
    res.status(200).json({
        group: "group deleted"
    })
}

// update a specific group from a unit
const updateGroup = async (req, res) => {
    res.status(200).json({
        group: "group updated"
    })
}

module.exports = {
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup
}