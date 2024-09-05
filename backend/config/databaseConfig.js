/**
 * This module creates the db connection so that it can easily be exported
 * To other modules that must use it
 *
 * Approach taken from:
 * https://www.edureka.co/community/88799/how-provide-mysql-database-connection-single-file-in-nodejs
 *
 */

const mysql = require('mysql2');
require('dotenv').config();
console.log(process.env.DB_HOST,process.env.DB_USER,process.env.MYSQL_ROOT_PASSWORD, process.env.DB, process.env.MYSQL_TCP_PORT,process.env.MYSQLHOST,process.env.MYSQLUSER )
const connection = mysql.createConnection({
    host: process.env.DOCKER_USE_MYSQL_HOST ? "database" : process.env.DB_HOST,  // docker compose service name which resolves to internal IP (by docker)
    user: process.env.DB_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.DB,
    port: process.env.MYSQL_TCP_PORT,
});

// const connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB,
//     connectionLimit: 10
// });

module.exports = connection;