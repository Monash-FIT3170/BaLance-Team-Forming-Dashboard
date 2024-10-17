const db_connection = require("../config/databaseConfig"); // Import the MySQL database configuration

const promiseBasedQuery = (query, values) => {
    /**
     * Function to wrap a MySQL query within a promise.
     * This allows the use of async/await syntax for database operations.
     * @param {string} query - The SQL query to execute
     * @param {array} values - The values to bind to the query placeholders
     * @returns {Promise} - Resolves with the query results, or rejects with an error
     * 
     * wraps a mysql2 query around a promise so that we can use await with queries
     */

    return new Promise((resolve, reject) => {
        db_connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error); // Log any errors for debugging
                reject(error); // Reject the promise if there is an error
            } else {
                // console.log(`${results.affectedRows} affected rows`);
                resolve(results); // Resolve the promise with the query results
            }
        });
    });
};

const selectUnitOffKey = async (unitCode, year, period) => {
  /**
   * Asynchronous function to retrieve the primary key (`unit_off_id`) for a unit offering.
   * The result is used to form enrollment data for that specific unit offering.

   * @param {string} unitCode - The code of the unit
   * @param {number} year - The year of the unit offering
   * @param {string} period - The academic period of the unit offering
   * @returns {Promise} - Resolves with the `unit_off_id`, or throws an error
   * 
   * obtains the primary key for a unit offering
   * result is used to form enrolment data for that unit offering
   */
    try { // Execute the query using promise-based query function and extract the unit_off_id
        const [{ unit_off_id }] = await promiseBasedQuery(
            "SELECT unit_off_id FROM unit_offering WHERE " + "unit_code=? AND unit_off_year=? AND unit_off_period=?;",
            [unitCode, year, period] // Bind values to query placeholders
        );
        return unit_off_id; // Return the primary key for the unit offering
    } catch (error) {
        throw error;  // Throw any errors for further handling
    }
};

module.exports = {
    promiseBasedQuery, // Export the promise-based query function
    selectUnitOffKey // Export the function to retrieve unit offering key
};
