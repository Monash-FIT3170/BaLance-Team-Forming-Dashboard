/**
 * A module containing helper functions specifically used to implement
 * groupController.js controller functions related to viewing group
 * analytics data
 *
 * */

const {promiseBasedQuery, selectUnitOffKey} = require("./commonHelpers");

const getUnitAnalyticsBelbin = async () => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the offering
     *
     */

}

const getUnitAnalyticsEffort = async () => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of student effort estimations across the offering
     *
     */

}

const getUnitAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies for a unit that can be called by their key
     *
     */

    "effort": getUnitAnalyticsEffort,
    "belbin": getUnitAnalyticsBelbin,
}

const getGroupAnalyticsBelbin = async () => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the group
     *
     */

}

const getGroupAnalyticsEffort = async () => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of student effort estimations across the group
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