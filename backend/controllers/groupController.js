/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */

// get all groups from a unit
const getAllGroups = async (req, res) => {
    let unitId = req.params.unitId;
    
    let groups = [
        {
            groupId: "001",
            groupNumber: "1",
            labId: "Lab01",
            members:  [
                {
                    studentFirstName: "Steve", 
                    studentLastName: "Jobs", 
                    studentEmail: "steve.jobs@apple.com"
                }, 
                {
                    studentFirstName: "Bill", 
                    studentLastName: "Gates", 
                    studentEmail: "bill.gates@microsoft.com"
                },
                {
                    studentFirstName: "Linus", 
                    studentLastName: "Torvalds", 
                    studentEmail: "linus.torvalds@linux.com"
                }
            ],
        },
        {
            groupId: "002",
            groupNumber: "2",
            labId: "Lab02",
            members:  [
                {
                    studentFirstName: "Michael", 
                    studentLastName: "Jordan", 
                    studentEmail: "michael.jordan@chicago.com"
                }, 
                {
                    studentFirstName: "LeBron", 
                    studentLastName: "James", 
                    studentEmail: "lebron.james@cleveland.com"
                },
                {
                    studentFirstName: "Kobe", 
                    studentLastName: "Bryant", 
                    studentEmail: "kobe.bryant@la.com"
                }
            ],
        }
    ]

    //groups = JSON.stringify(groups);
    
    res.send(groups);
}

// get a single group from a unit
const getGroup = async (req, res) => {
    let unitId = req.params.unitId;
    let groupId = req.params.group
    
    let group = {
        groupId: "001",
        groupNumber: "1",
        labId: "Lab01",
        members:  [
            {
                studentFirstName: "Steve", 
                studentLastName: "Jobs", 
                studentEmail: "steve.jobs@apple.com"
            }, 
            {
                studentFirstName: "Bill", 
                studentLastName: "Gates", 
                studentEmail: "bill.gates@microsoft.com"
            },
            {
                studentFirstName: "Linus", 
                studentLastName: "Torvalds", 
                studentEmail: "linus.torvalds@linux.com"
            }
        ],
    }

    //group = JSON.stringify(group);

    res.send(group);
}

const createUnitGroups = async (req, res) => {
    


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
    getAllGroups,
    getGroup,
    addGroup,
    deleteGroup,
    updateGroup,
    createUnitGroups
}