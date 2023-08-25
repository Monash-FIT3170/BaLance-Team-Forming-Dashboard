/**
 * A module containing controller functions for routes related to
 * group data within a unit.
 *
 */
const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

const {
    getUnitAnalyticsStrategies,
    getGroupAnalyticsStrategies
} = require("../helpers/groupAnalyticsHelpers")

const getAllGroupsAnalytics = async (req,res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;

    console.log("getALL groups controller")

    let unitAnalyticStrategiesBelbin = await getUnitAnalyticsStrategies["belbin"](unitCode, year, period)

    let unitAnalyticData = [];

    // loop through the unitAnalyticStrategies and append their results to the unitAnalyticData array todo
    unitAnalyticData.push(unitAnalyticStrategiesBelbin)
    // let obj =
    // {
    //         "personality title": "Student Effort",
    //         "description": "How much effort is put to a unit and marks obtained",
    //         "categorical data": [
    //           {
    //             "title": "Weekly hour commitment to the unit",
    //             "x label": "Weekly hour commitment",
    //             "y label": "Number of students",
    //             "x": ["0-4", "4-8", "8-12", "12+"],
    //             "y": [5, 10, 45, 30]
    //           },
    //           {
    //             "title": "Average assignment mark distribution",
    //             "x label": ["Average assignment marks"],
    //             "y label": ["Number of students"],
    //             "x": ["N", "P", "C", "D", "HD"],
    //             "y": [10, 10, 20, 30, 15]
    //           }
    //         ],
    //         "numerical data": [
    //           {
    //             "title": "Distribution of marks per hour",
    //             "x label": "Marks per hour",
    //             "y label": "Number of students",
    //             "x": [0.2, 0.5, 0.6, 0.8, 1.2],
    //             "y": [10, 15, 17, 22, 7]
    //           }
    //         ]
    //       }
    // unitAnalyticData.push(obj)
    
    res.status(200);
    res.send(unitAnalyticData);
}
const getGroupAnalytics = async (req,res) => {
    const {
        unitCode,
        year,
        period,
        groupNumber
    } = req.params;

    const groupAnalyticData = [];

    await getGroupAnalyticsStrategies[groupAnalyticData](unitCode, year, period,groupNumber)


    // loop through the groupAnalyticStrategies and append their results to the groupAnalyticData array todo
    for (let i = 0;i<groupAnalyticData.length;i++){
        groupAnalyticData.push(groupAnalyticData)
    }

    res.status(200).json(groupAnalyticData);
}


module.exports = {
    getAllGroupsAnalytics,
    getGroupAnalytics

}