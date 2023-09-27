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

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    connectionLimit: 10
});

module.exports = connection;