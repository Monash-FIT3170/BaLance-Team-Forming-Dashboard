const express = require('express');
const {Sequelize} = require('sequelize');
const unitRoutes = require('./routes/units');
const teamRoutes = require('./routes/groups');

// attach .env contents to the global process object
require('dotenv').config();

// set up the express app
const app = express();

// required to attach reqs with a body to the req object for req handling
app.use(express.json());

// route middleware
app.use('api/units/', unitRoutes);
app.use('api/units/:unitId/', teamRoutes);

// TODO connect to mysql -> listen to port after connection

// listen to port
app.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}`);
})