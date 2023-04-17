const express = require('express');
const unitRoutes = require('./routes/units');
const teamRoutes = require('./routes/teams');

// attach .env contents to the global process object
require('dotenv').config();

const app = express();

app.use('/units', unitRoutes);
app.use('/teams', teamRoutes);

// listen to port number
app.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}`);
})