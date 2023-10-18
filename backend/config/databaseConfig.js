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

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "A19003607",
    database: "student_group_db"
});

module.exports = connection;