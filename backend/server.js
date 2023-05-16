const express = require('express');
const {Sequelize} = require('sequelize');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');
const studentRoutes = require('./routes/students');
const cors = require('cors');

// attach .env contents to the global process object
require('dotenv').config();

const corsOptions = {
    origin:'*',
    credentials:true,
    optionsSuccessStatus:200,
}

// set up the express app
const app = express();

// required to attach reqs with a body to the req object for req handling
app.use(express.json());

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// route middleware
app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);
app.use('/api/students/', studentRoutes);

// TODO connect to mysql -> listen to port after connection
// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT}`);
});