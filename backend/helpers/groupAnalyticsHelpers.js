/**
 * A module containing helper functions specifically used to implement
 * groupController.js controller functions related to viewing group
 * analytics data
 *
 * */

const {promiseBasedQuery, selectUnitOffKey} = require("./commonHelpers");

const getUnitAnalyticsBelbin = async (unitCode, year, offering) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the offering and returns it
     *
     */

    const personalityData = {
        "personality title": "Belbin personality types",
        "description:": "Based on the work of Meredith Belbin, the Belbin roles broadly " +
                        "categorised people into one of 3 types: action-oriented, people-oriented " +
                        "and thinking-oriented.",
        "data": []
    }

    // get the proportion of the 3 belbin roles within a unit offering and put it into personalityData.data
}

const getUnitAnalyticsEffort = async (unitCode, year, offering) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of student effort estimations across the offering and returns it
     *
     */

    const belbinData = {
        "personality title": "Estimated effort",
        "description:": "Estimated effort is an indicators of how well a student performs and what they are willing " +
                        " to put into the current unit offering. It is an aggregation of their own estimate of average " +
                        " assignment marks in the past and number of hours they are willing to put into the unit.",
        "data": []
    }

    // get the proportion of different assignment average and hours to put in and append to personalityData.data


    // get numerical data and put it in too

}

const getUnitAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies for a unit that can be called by their key
     *
     */

    "effort": getUnitAnalyticsEffort,
    "belbin": getUnitAnalyticsBelbin,
}

const getGroupAnalyticsBelbin = async (unitCode, year, offering, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the group  and returns it
     *
     */

}

const getGroupAnalyticsEffort = async (unitCode, year, offering, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of student effort estimations across the group and returns it
     *
     */

}

const getGroupAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies that can be called by their key
     *
     */

    "effort": getGroupAnalyticsEffort,
    "belbin": getGroupAnalyticsBelbin,
}


module.exports = {
    getUnitAnalyticsStrategies,
    getGroupAnalyticsStrategies
}