const express = require('express');
const {Sequelize} = require('sequelize');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');

// attach .env contents to the global process object
require('dotenv').config();

// set up the express app
const app = express();

// required to attach reqs with a body to the req object for req handling
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// route middleware
app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);

// TODO connect to mysql -> listen to port after connection
// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT}`);
});