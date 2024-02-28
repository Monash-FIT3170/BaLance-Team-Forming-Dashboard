/**
 * This module should only contain functions that handle routes related
 * to fetching unit analytics data for the analytics display
 *
 * */

const {
    getUnitAnalyticsStrategies,
    getGroupAnalyticsStrategies
} = require("../helpers/analyticsRouteHandlerHelpers");

const getUnitAnalytics = async (req, res) => {
    /**
     * Loops through a store of functions that fetch related unit level data for a specific
     * group formation strategy. E.g. {belbin: func1(), effort: func2()} and then appends the
     * result to an array before sending it to the frontend.
     *
     */

    const { unitCode, year, period } = req.params;
    const unitAnalyticData = [];

    // loop through the strategies and append their results to the data array
    for (let personality_quiz in getUnitAnalyticsStrategies) {
        let analytics = await getUnitAnalyticsStrategies[personality_quiz](unitCode, year, period);
        unitAnalyticData.push(analytics);
    }

    res.status(200).json(unitAnalyticData);
};

const getGroupAnalytics = async (req, res) => {
    /**
     * Loops through a store of functions that fetch related group level data for a specific
     * group formation strategy. E.g. {belbin: func1(), effort: func2()} and then appends the
     * result to an array before sending it to the frontend.
     *
     */

    const { unitCode, year, period, groupNumber } = req.params;
    const groupAnalyticData = [];

    // loop through the strategies and append their results to the data array
    for (let personality_quiz in getGroupAnalyticsStrategies) {
        let analytics = await getGroupAnalyticsStrategies[personality_quiz](unitCode, year, period, groupNumber);
        groupAnalyticData.push(analytics);
    }

    res.status(200).json(groupAnalyticData);
};

module.exports = {
    getUnitAnalytics,
    getGroupAnalytics
};
