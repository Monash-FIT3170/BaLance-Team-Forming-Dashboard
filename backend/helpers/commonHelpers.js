const db_connection = require("../config/databaseConfig");

const promiseBasedQuery = (query, values) => {
    /**
     * wraps a mysql2 query around a promise so that we can use await with queries
     */
    return new Promise((resolve, reject) => {
        db_connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log(`${results.affectedRows} affected rows`)
                resolve(results);
            }
        });
    });
}

const selectUnitOffKey = async (unitCode, year, period) => {
    /**
     * obtains the primary key for a unit offering
     * result is used to form enrolment fata for that unit offering
     */
    try {
        const [{unit_off_id}] = await promiseBasedQuery(
            'SELECT unit_off_id FROM unit_offering WHERE ' +
            'unit_code=? AND unit_off_year=? AND unit_off_period=?;',
            [unitCode, year, period]
        )
        return unit_off_id;
    } catch(error) {
        throw error
    }
}

module.exports = {
    promiseBasedQuery,
    selectUnitOffKey
}