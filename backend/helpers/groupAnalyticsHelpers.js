/**
 * A module containing helper functions specifically used to implement
 * groupController.js controller functions related to viewing group
 * analytics data
 *
 * */

const { promiseBasedQuery, selectUnitOffKey } = require("./commonHelpers");

const getUnitAnalyticsBelbin = async (unitCode, year, period) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the offering and returns it
     *
     */

    const belbinAnalyticData = {
        "personality title": "Belbin personality types",
        "description:": "Based on the work of Meredith Belbin, the Belbin roles broadly " +
                        "categorise people into one of 3 types: action-oriented, people-" +
                        "oriented and thinking-oriented. People-oriented are generally l" +
                        "eadership type personalities while action and thinking serve as" +
                        " more supportive roles.",
        "data": []
    }

    const belbinDoughnutChartData = {
        "type": "doughnut",
        "title": "Belbin role distribution",
        "x label": "Belbin personality type",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const belbinResults = promiseBasedQuery(
        "SELECT b.belbin_type " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN belbin_result b ON b.personality_test_attempt = pa.test_attempt_id " +
        " WHERE u.unit_code=?" +
        " AND u.unit_off_year=? " +
        " AND u.unit_off_period=?;",
        [unitCode, year, period]
    )

    // get the proportion of the 3 belbin types and insert x & y data to doughnutChartData accordingly
    const belbinTypeHistogram = {
        "Action": 0,
        "People": 0,
        "Thinking": 0
    }

    // todo counting

    belbinAnalyticData["data"].push(belbinDoughnutChartData)
    return belbinAnalyticData;
}

const getUnitAnalyticsEffort = async (unitCode, year, period) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of student effort estimations across the offering and returns it
     *
     */

    const effortAnalyticsData = {
        "personality title": "Estimated effort",
        "description:": "Estimated effort is an indicator of how well a student performs" +
                        " and what they are willing to put into the current unit offerin" +
                        "g. It is an aggregation of their own estimate of average assign" +
                        "ment marks in the past and number of hours they are willing to " +
                        "put into the unit.",
        "data": []
    }

    const marksDoughnutChartData = {
        "type": "doughnut",
        "title": "Average marks distribution",
        "x label": "Average marks estimate",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const hoursDoughnutChartData = {
        "type": "doughnut",
        "title": "Weekly hours commitment distribution",
        "x label": "Weekly hours commitment",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const effortBarChartData = {
        "type": "bar",
        "title": "Estimation of expected effort into unit distribution",
        "x label": "Student effort",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const effortResults = promiseBasedQuery(
        "",
        []
    )

    // convert hours and average marks into categorical ranges todo

    // count hours, average marks and effort data todo

    // append data to appropriate variables todo

    effortAnalyticsData["data"].push(marksDoughnutChartData)
    effortAnalyticsData["data"].push(hoursDoughnutChartData)
    effortAnalyticsData["data"].push(effortBarChartData)
    return effortAnalyticsData
}

const getUnitAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies for a unit that can be called by their key
     *
     */

    "effort": getUnitAnalyticsEffort,
    "belbin": getUnitAnalyticsBelbin,
}

const getGroupAnalyticsBelbin = async (unitCode, year, period, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the group  and returns it
     *
     */

    const belbinAnalyticData = {
        "personality title": "Belbin personality types",
        "description:": "Based on the work of Meredith Belbin, the Belbin roles broadly " +
            "categorise people into one of 3 types: action-oriented, people-" +
            "oriented and thinking-oriented. People-oriented are generally l" +
            "eadership type personalities while action and thinking serve as" +
            " more supportive roles.",
        "data": []
    }

    const belbinDoughnutChartData = {
        "type": "doughnut",
        "title": "Belbin role distribution",
        "x label": "Belbin personality type",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const belbinResults = promiseBasedQuery( // todo update query to be for specific group
        "SELECT b.belbin_type " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN belbin_result b ON b.personality_test_attempt = pa.test_attempt_id " +
        " WHERE u.unit_code=?" +
        " AND u.unit_off_year=? " +
        " AND u.unit_off_period=?;",
        [unitCode, year, period]
    )

    // get the proportion of the 3 belbin types and insert x & y data to doughnutChartData accordingly
    const belbinTypeHistogram = {
        "Action": 0,
        "People": 0,
        "Thinking": 0
    }

    // todo counting

    belbinAnalyticData["data"].push(belbinDoughnutChartData)
    return belbinAnalyticData;
}

const getGroupAnalyticsEffort = async (unitCode, year, period, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of student effort estimations across the group and returns it
     *
     */

    const effortAnalyticsData = {
        "personality title": "Estimated effort",
        "description:": "Estimated effort is an indicator of how well a student performs" +
            " and what they are willing to put into the current unit offerin" +
            "g. It is an aggregation of their own estimate of average assign" +
            "ment marks in the past and number of hours they are willing to " +
            "put into the unit.",
        "data": []
    }

    const marksDoughnutChartData = {
        "type": "doughnut",
        "title": "Average marks distribution",
        "x label": "Average marks estimate",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const hoursDoughnutChartData = {
        "type": "doughnut",
        "title": "Weekly hours commitment distribution",
        "x label": "Weekly hours commitment",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const effortBarChartData = {
        "type": "bar",
        "title": "Estimation of expected effort into unit distribution",
        "x label": "Student effort",
        "y label": "Number of students",
        "x": [],
        "y": []
    }

    const effortResults = promiseBasedQuery( // todo query for a specific group
        "",
        []
    )

    // convert hours and average marks into categorical ranges todo

    // count hours, average marks and effort data todo

    // append data to appropriate variables todo

    effortAnalyticsData["data"].push(marksDoughnutChartData)
    effortAnalyticsData["data"].push(hoursDoughnutChartData)
    effortAnalyticsData["data"].push(effortBarChartData)
    return effortAnalyticsData
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