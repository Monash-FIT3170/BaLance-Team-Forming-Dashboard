/**
 * A module containing controller functions for routes related to
 * group analytics data within a unit.
 *
 */

const { getUnitAnalyticsStrategies, getGroupAnalyticsStrategies } = require("../helpers/analyticsRouteHandlerHelpers");

const getUnitAnalytics = async (req, res) => {
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
  const { unitCode, year, period, groupNumber } = req.params;

  console.log(unitCode, year, period, groupNumber);
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
  getGroupAnalytics,
};
