const { promiseBasedQuery } = require("./commonHelpers");

const getUnitAnalyticsBelbin = async (unitCode, year, period) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the offering and returns it
     *
     */

    const belbinAnalyticData = {
        "personality title": "Belbin personality types",
        "description":
            "Based on the work of Meredith Belbin, the Belbin roles broadly " +
            "categorise people into one of 3 types: action-oriented, people-" +
            "oriented and thinking-oriented. People-oriented are generally l" +
            "eadership type personalities while action and thinking serve as" +
            " more supportive roles.",
        data: [],
    };

    const belbinDoughnutChartData = {
        type: "doughnut",
        title: "Belbin role distribution",
        "x label": "Belbin personality type",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const belbinResults = await promiseBasedQuery(
        "SELECT b.belbin_type, count(b.belbin_type) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN belbin_result b ON b.personality_test_attempt = pa.test_attempt_id " +
        "   WHERE u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "GROUP BY b.belbin_type;",
        [unitCode, year, period]
    );

    if (belbinResults.length > 0) {
        belbinResults.forEach((result) => {
            belbinDoughnutChartData["x"].push(result["belbin_type"]);
            belbinDoughnutChartData["y"].push(result["count"]);
        });

        belbinAnalyticData["data"].push(belbinDoughnutChartData);
    }

    return belbinAnalyticData;
};

const getUnitAnalyticsEffort = async (unitCode, year, period) => {
    /**
     * Given a unit offering, obtains all information related to the distribution
     * of student effort estimations across the offering and returns it
     *
     */

    const effortAnalyticsData = {
        "personality title": "Estimated effort",
        "description":
            "Estimated effort is an indicator of how well a student performs" +
            " and what they are willing to put into the current unit offerin" +
            "g. It is an aggregation of their own estimate of average assign" +
            "ment marks in the past and number of hours they are willing to " +
            "put into the unit.",
        data: [],
    };

    const marksDoughnutChartData = {
        type: "doughnut",
        title: "Average marks distribution",
        "x label": "Average marks estimate",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const hoursDoughnutChartData = {
        type: "doughnut",
        title: "Weekly hours commitment distribution",
        "x label": "Weekly hours commitment",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const effortBarChartData = {
        type: "bar",
        title: "Estimation of expected effort into unit distribution",
        "x label": "Student effort",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const gradeResults = await promiseBasedQuery(
        "SELECT CASE " +
        "       WHEN e.assignment_avg <50 THEN 'N' " +
        "       WHEN e.assignment_avg <60 THEN 'P' " +
        "       WHEN e.assignment_avg <70 THEN 'C' " +
        "       WHEN e.assignment_avg <80 THEN 'D' " +
        "       WHEN e.assignment_avg <=100 THEN 'HD' " +
        "   END AS letter_grade, count(e.assignment_avg) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id " +
        "   WHERE u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "GROUP BY letter_grade;",
        [unitCode, year, period]
    );

    const hourResults = await promiseBasedQuery(
        "SELECT CASE " +
        "       WHEN e.time_commitment_hrs <4 THEN '0-4' " +
        "       WHEN e.time_commitment_hrs <8 THEN '4-8' " +
        "       WHEN e.time_commitment_hrs <12 THEN '8-12' " +
        "       WHEN e.time_commitment_hrs >=12 THEN '12+' " +
        "   END AS hours, count(e.time_commitment_hrs) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id " +
        "   WHERE u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "GROUP BY hours;",
       [unitCode, year, period]
    );

    const effortResults = await promiseBasedQuery(
        "SELECT e.marks_per_hour AS effort, count(e.time_commitment_hrs) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id " +
        "   WHERE u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "GROUP BY effort;",
        [unitCode, year, period]
    );

    if (gradeResults.length > 0 && hourResults.length > 0 && effortResults.length > 0) {
        gradeResults.forEach((result) => {
            marksDoughnutChartData["x"].push(result["letter_grade"]);
            marksDoughnutChartData["y"].push(result["count"]);
        });

        hourResults.forEach((result) => {
            hoursDoughnutChartData["x"].push(result["hours"]);
            hoursDoughnutChartData["y"].push(result["count"]);
        });

        effortResults.forEach((result) => {
            effortBarChartData["x"].push(result["effort"]);
            effortBarChartData["y"].push(result["count"]);
        });

        effortAnalyticsData["data"].push(marksDoughnutChartData);
        effortAnalyticsData["data"].push(hoursDoughnutChartData);
        effortAnalyticsData["data"].push(effortBarChartData);
    }

    return effortAnalyticsData;
};

const getUnitAnalyticsPreference = async (unitCode, year, period) => {
    /**
     * Given a unit offering, obtains all information related to student preference
     * to group matching
     */

    const preferenceAnalyticsData = {
        "personality title": "Preference Selection",
        "description":
            "Based on the input of each student, our algorithm attempts to a" +
            "ssign each student their most preferred group. This is an aggre" +
            "gation of how many students were assigned to their nth preferre" +
            "d selection.",
        data: [],
    };

    const preferenceResults = await promiseBasedQuery(
        "SELECT pp.preference_rank AS preference, COUNT(pp.preference_rank) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN preference_submission ps ON ps.personality_test_attempt = pa.test_attempt_id " +
        "INNER JOIN project_preference pp ON pp.preference_submission_id = ps.preference_submission_id " +
        "INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id " +
        "INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id " +
        "INNER JOIN lab_group lg ON lg.lab_group_id = ga.lab_group_id " +
        "   WHERE pp.project_number = lg.group_number " +
        "   AND u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "GROUP BY pp.preference_rank " +
        "ORDER BY pp.preference_rank ASC; ",
        [unitCode, year, period]
    );

    const preferenceBarChartData = {
        type: "bar",
        title: "Number of students assigned to their nth preferred group",
        "x label": "Student effort",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    if (preferenceResults.length > 0) {
        preferenceResults.forEach((result) => {
            preferenceBarChartData["x"].push(result["preference"]);
            preferenceBarChartData["y"].push(result["count"]);
        });

        preferenceAnalyticsData["data"].push(preferenceBarChartData);
    }
    
    return preferenceAnalyticsData
}

const getUnitAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies for a unit that can be called by their key
     *
     */

    effort: getUnitAnalyticsEffort,
    belbin: getUnitAnalyticsBelbin,
    preference: getUnitAnalyticsPreference
};

const getGroupAnalyticsBelbin = async (unitCode, year, period, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of Belbin personality types across the group  and returns it
     *
     */

    const belbinAnalyticData = {
        "personality title": "Belbin personality types",
        "description":
            "Based on the work of Meredith Belbin, the Belbin roles broadly " +
            "categorise people into one of 3 types: action-oriented, people-" +
            "oriented and thinking-oriented. People-oriented are generally l" +
            "eadership type personalities while action and thinking serve as" +
            " more supportive roles.",
        data: [],
    };

    const belbinDoughnutChartData = {
        type: "doughnut",
        title: "Belbin role distribution",
        "x label": "Belbin personality type",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const belbinResults = await promiseBasedQuery(
        "SELECT b.belbin_type, count(b.belbin_type) AS 'count' " +
        "        FROM unit_offering u " +
        "        INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "        INNER JOIN belbin_result b ON b.personality_test_attempt = pa.test_attempt_id " +
        "        INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id " +
        "        INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id " +
        "        INNER JOIN lab_group g ON g.lab_group_id = ga.lab_group_id " +
        "           WHERE u.unit_code=? " +
        "           AND u.unit_off_year=? " +
        "           AND u.unit_off_period=? " +
        "           AND g.group_number=? " +
        "        GROUP BY b.belbin_type;",
        [unitCode, year, period, groupNumber]
    );

    if (belbinResults.length > 0) {
        belbinResults.forEach((result) => {
            belbinDoughnutChartData["x"].push(result["belbin_type"]);
            belbinDoughnutChartData["y"].push(result["count"]);
        });

        belbinAnalyticData["data"].push(belbinDoughnutChartData);
    }

    return belbinAnalyticData;
};

const getGroupAnalyticsEffort = async (unitCode, year, period, groupNumber) => {
    /**
     * Given a group within a unit offering, obtains all information related to the distribution
     * of student effort estimations across the group and returns it
     *
     */

    const effortAnalyticsData = {
        "personality title": "Estimated effort",
        "description":
            "Estimated effort is an indicator of how well a student performs" +
            " and what they are willing to put into the current unit offerin" +
            "g. It is an aggregation of their own estimate of average assign" +
            "ment marks in the past and number of hours they are willing to " +
            "put into the unit.",
        data: [],
    };

    const marksDoughnutChartData = {
        type: "doughnut",
        title: "Average marks distribution",
        "x label": "Average marks estimate",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const hoursDoughnutChartData = {
        type: "doughnut",
        title: "Weekly hours commitment distribution",
        "x label": "Weekly hours commitment",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const effortBarChartData = {
        type: "bar",
        title: "Estimation of expected effort into unit distribution",
        "x label": "Student effort",
        "y label": "Number of students",
        x: [],
        y: [],
    };

    const gradeResults = await promiseBasedQuery(
        "SELECT CASE\n" +
        "       WHEN e.assignment_avg <50 THEN 'N'\n" +
        "       WHEN e.assignment_avg <60 THEN 'P'\n" +
        "       WHEN e.assignment_avg <70 THEN 'C'\n" +
        "       WHEN e.assignment_avg <80 THEN 'D'\n" +
        "       WHEN e.assignment_avg <=100 THEN 'HD'\n" +
        "   END AS letter_grade, count(e.assignment_avg) AS 'count'\n" +
        "FROM unit_offering u\n" +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id\n" +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id\n" +
        "INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id\n" +
        "INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id\n" +
        "INNER JOIN lab_group g ON g.lab_group_id = ga.lab_group_id\n" +
        "   WHERE u.unit_code=?\n" +
        "   AND u.unit_off_year=?\n" +
        "   AND u.unit_off_period=?\n" +
        "   AND g.group_number=?\n" +
        "GROUP BY letter_grade;",
        [unitCode, year, period, groupNumber]
    );


    const hourResults = await promiseBasedQuery(
        "SELECT CASE\n" +
        "WHEN e.time_commitment_hrs <4 THEN '0-4'\n" +
        "WHEN e.time_commitment_hrs <8 THEN '4-8'\n" +
        "WHEN e.time_commitment_hrs <12 THEN '8-12'\n" +
        "WHEN e.time_commitment_hrs >=12 THEN '12+'\n" +
        "END AS hours, count(e.time_commitment_hrs) AS 'count'\n" +
        "FROM unit_offering u\n" +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id\n" +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id\n" +
        "INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id\n" +
        "INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id\n" +
        "INNER JOIN lab_group g ON g.lab_group_id = ga.lab_group_id\n" +
        "   WHERE u.unit_code=?\n" +
        "   AND u.unit_off_year=?\n" +
        "   AND u.unit_off_period=?\n" +
        "   AND g.group_number=?\n" +
        "GROUP BY hours;",
        [unitCode, year, period, groupNumber]
    );


    const effortResults = await promiseBasedQuery(
       "SELECT e.marks_per_hour AS effort, count(e.time_commitment_hrs) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN effort_result e ON e.personality_test_attempt = pa.test_attempt_id " +
        "INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id " +
        "INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id " +
        "INNER JOIN lab_group g ON g.lab_group_id = ga.lab_group_id " +
        "   WHERE u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=? " +
        "   AND g.group_number=? " +
        "GROUP BY effort;",
        [unitCode, year, period, groupNumber]
    );

    if (gradeResults.length > 0 && hourResults.length > 0 && effortResults.length > 0) {
        gradeResults.forEach((result) => {
            marksDoughnutChartData["x"].push(result["letter_grade"]);
            marksDoughnutChartData["y"].push(result["count"]);
        });

        hourResults.forEach((result) => {
            hoursDoughnutChartData["x"].push(result["hours"]);
            hoursDoughnutChartData["y"].push(result["count"]);
        });

        effortResults.forEach((result) => {
            effortBarChartData["x"].push(result["effort"]);
            effortBarChartData["y"].push(result["count"]);
        });

        effortAnalyticsData["data"].push(marksDoughnutChartData);
        effortAnalyticsData["data"].push(hoursDoughnutChartData);
        effortAnalyticsData["data"].push(effortBarChartData);
    }

    return effortAnalyticsData;
};

const getGroupAnalyticsPreference = async (unitCode, year, period, groupNumber) => {
    /**
     * Given a group, obtains all information related to student preference
     * to group matching
     */

    const preferenceAnalyticsData = {
        "personality title": "Preference Selection",
        "description":
            "Based on the input of each student, our algorithm attempts to a" +
            "ssign each student their most preferred group. This is an aggre" +
            "gation of how many students were assigned to their nth preferre" +
            "d selection.",
        data: [],
    };

    const preferenceResults = await promiseBasedQuery(
        "SELECT pp.preference_rank AS preference, COUNT(pp.preference_rank) AS 'count' " +
        "FROM unit_offering u " +
        "INNER JOIN personality_test_attempt pa ON u.unit_off_id = pa.unit_off_id " +
        "INNER JOIN preference_submission ps ON ps.personality_test_attempt = pa.test_attempt_id " +
        "INNER JOIN project_preference pp ON pp.preference_submission_id = ps.preference_submission_id " +
        "INNER JOIN student s ON s.stud_unique_id = pa.stud_unique_id " +
        "INNER JOIN group_allocation ga ON ga.stud_unique_id = s.stud_unique_id " +
        "INNER JOIN lab_group lg ON lg.lab_group_id = ga.lab_group_id " +
        "WHERE pp.project_number = lg.group_number " +
        "AND u.unit_code =? " +
        "AND u.unit_off_year =? " +
        "AND u.unit_off_period =? " +
        "AND lg.group_number =? " +
        "GROUP BY pp.preference_rank " +
        "ORDER BY pp.preference_rank ASC; ",
        [unitCode, year, period, groupNumber]
    )

    /** const preferenceResults = await promiseBasedQuery("FILL THIS SQL CODE IN THANKS" [unitCode, year, period, groupNumber]) */

    const preferenceBarChartData = {
        type: "bar",
        title: "Number of students assigned to their nth preferred group",
        "x label": "Student effort",
        "y label": "Number of students",
        x: [],
        y: [],
    };

   if (preferenceResults.length > 0) {
         preferenceResults.forEach((result) => {
              preferenceBarChartData["x"].push(result["preference"]);
              preferenceBarChartData["y"].push(result["count"]);
         });

         preferenceAnalyticsData["data"].push(preferenceBarChartData);
     }
    
    return preferenceAnalyticsData
}

const getGroupAnalyticsStrategies = {
    /**
     * A store of various get analytics strategies that can be called by their key
     *
     */

    effort: getGroupAnalyticsEffort,
    belbin: getGroupAnalyticsBelbin,
    preference: getGroupAnalyticsPreference
};

module.exports = {
    getUnitAnalyticsStrategies,
    getGroupAnalyticsStrategies,
};
