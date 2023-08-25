const {
    promiseBasedQuery,
    selectUnitOffKey
} = require("../helpers/commonHelpers");

const {
    getUnitAnalyticsStrategies,
    getGroupAnalyticsStrategies
} = require("../helpers/analyticsControllerHelpers")

const getAllGroupsAnalytics = async (req,res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;

    console.log("get ALL groups controller")

    // unitAnalyticStrategiesBelbin = await getUnitAnalyticsStrategies["belbin"](unitCode, year, period)
    //
    // const unitAnalyticData = [];
    //
    // // loop through the unitAnalyticStrategies and append their results to the unitAnalyticData array todo
    //
    // for (let i =0; i < unitAnalyticStrategiesEffort.length;i++){
    //     console.log("unitAnalyticStrategies: "+unitAnalyticStrategies[i])
    //
    //     unitAnalyticData.push(unitAnalyticStrategies[i])
    //
    // }
    //
    // res.status(200).json(unitAnalyticData);
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