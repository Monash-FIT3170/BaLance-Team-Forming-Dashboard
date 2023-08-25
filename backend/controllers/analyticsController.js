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
} = require("../helpers/analyticsControllerHelpers")

const getUnitAnalytics = async (req,res) => {
    const {
        unitCode,
        year,
        period
    } = req.params;

    console.log("getting unit analytics")
    const unitAnalyticData = [];

    // loop through the strategies and append their results to the data array
    for(let personality_quiz in getUnitAnalyticsStrategies){
        let analytics = await getUnitAnalyticsStrategies[personality_quiz](unitCode, year, period);
        unitAnalyticData.push(analytics);
    }

    console.log(JSON.stringify(unitAnalyticData))
    res.status(200).json(unitAnalyticData);
}

const getGroupAnalytics = async (req,res) => {
    const {
        unitCode,
        year,
        period,
        groupNumber
    } = req.params;

    console.log("getting unit analytics")
    const groupAnalyticData = [];

    // loop through the strategies and append their results to the data array
    for(let personality_quiz in getGroupAnalyticsStrategies){
        let analytics = await getGroupAnalyticsStrategies[personality_quiz](unitCode, year, period, groupNumber);
        groupAnalyticData.push(analytics);
    }

    console.log(JSON.stringify(groupAnalyticData))
    res.status(200).json(groupAnalyticData);
}

module.exports = {
    getUnitAnalytics,
    getGroupAnalytics
}