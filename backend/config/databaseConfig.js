/**
 * This module creates the db connection so that it can easily be exported
 * To other modules that must use it
 *
 * Approach taken from:
 * https://www.edureka.co/community/88799/how-provide-mysql-database-connection-single-file-in-nodejs
 *
 */

const mysql = require('mysql2'); // Import the mysql2 package for MySQL database interaction
require('dotenv').config(); // Load environment variables from a .env file for configuration

const connection = mysql.createConnection({
    host: process.env.MYSQLHOST,  // docker compose service name which resolves to internal IP (by docker)
    user: process.env.MYSQLUSER, 
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT,
});

// const connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB,
//     connectionLimit: 10
// });

module.exports = connection; // Export the connection object to be used in other parts of the application