const db_connection = require("../db_connection");

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

module.exports = {
    promiseBasedQuery
}