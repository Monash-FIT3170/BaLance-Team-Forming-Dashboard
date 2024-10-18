/**
 * This module should only contain functions that handle routes related
 * to fetching unit analytics data for the analytics display
 *
 * */

const {
    getUnitAnalyticsStrategies,// Importing unit analytics strategy functions
    getGroupAnalyticsStrategies// Importing group analytics strategy functions
} = require("../helpers/analyticsRouteHandlerHelpers");

// Function to handle requests for unit-level analytics data
const getUnitAnalytics = async (req, res) => {
    /**
     * Loops through a store of functions that fetch related unit level data for a specific
     * group formation strategy. E.g. {belbin: func1(), effort: func2()} and then appends the
     * result to an array before sending it to the frontend.
     *
     */

    const { unitCode, year, period } = req.params;// Destructure parameters from the request object
    const unitAnalyticData = [];// Initialize an array to hold the analytics data

    // loop through the strategies and append their results to the data array
    for (let personality_quiz in getUnitAnalyticsStrategies) {
        let analytics = await getUnitAnalyticsStrategies[personality_quiz](unitCode, year, period);// Call the current strategy function with the required parameters
        unitAnalyticData.push(analytics);// Append the result of the strategy function to the unitAnalyticData array
    }

    res.status(200).json(unitAnalyticData);// Send a JSON response with the unit analytics data and a status code of 200 (OK)
};

// Function to handle requests for group-level analytics data
const getGroupAnalytics = async (req, res) => {
    /**
     * Loops through a store of functions that fetch related group level data for a specific
     * group formation strategy. E.g. {belbin: func1(), effort: func2()} and then appends the
     * result to an array before sending it to the frontend.
     *
     */

    const { unitCode, year, period, groupNumber } = req.params;// Destructure parameters from the request object
    const groupAnalyticData = [];// Initialize an array to hold the analytics data for groups

    // loop through the strategies and append their results to the data array
    for (let personality_quiz in getGroupAnalyticsStrategies) {
        let analytics = await getGroupAnalyticsStrategies[personality_quiz](unitCode, year, period, groupNumber);// Call the current strategy function with the required parameters
        groupAnalyticData.push(analytics);// Append the result of the strategy function to the groupAnalyticData array
    }

    res.status(200).json(groupAnalyticData);// Send a JSON response with the group analytics data and a status code of 200 (OK)
};

module.exports = {// Export the functions for use in other modules
    getUnitAnalytics,
    getGroupAnalytics
};
