const express = require('express');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');
const studentRoutes = require('./routes/students');
const analyticsRoutes = require('./routes/analytics');
const formsRoutes = require('./routes/forms');
const mailingRoutes = require('./routes/mailing')
const cors = require('cors');
const db_connection = require("./config/databaseConfig");
const { auth0Middleware } = require('./middleware/auth0Middleware');
const { mockAuthMiddleware } = require('./middleware/mockAuthMiddleware');

// attach .env contents to the global process object
require('dotenv').config();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
}

const app = express();

// required to attach reqs with a body to the req object for req handling
app.use(express.json());
app.use(cors(corsOptions));


if (process.env.AUTH == "TEST") { auth0Middleware(app); }

if (process.env.AUTH == "DEV" || process.env.AUTH == null) { mockAuthMiddleware(app); }



app.use(async (req, res, next) => {
    try {
        if (req.user && req.user.email) {
            const results = await db_connection.promise().query(
                `SELECT * FROM staff WHERE email_address='${req.user.email}';`
            );

            if (results[0].length === 0) {
                await db_connection.promise().query(
                    `INSERT INTO staff (preferred_name, last_name, email_address)
                     VALUES ('${req.user.nickname}', '${req.user.nickname}', '${req.user.email}');`
                );
            }
        }
        next();
    } catch (error) {
        console.error('Error updating staff info:', error);
        res.status(500).send('Server error');
    }
});
app.use((req, res, next) => {
    console.log(req.path, req.method);
    if (req.user) {
        console.log('Authenticated user');
    } else {
        console.log('Unauthenticated request');
    }
    next();
});

app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);
app.use('/api/students/', studentRoutes);
app.use('/api/analytics/', analyticsRoutes);
app.use('/api/forms/', formsRoutes);;
app.use('/api/mailing/', mailingRoutes)


app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
    console.log(`listening to port ${process.env.PORT || 8080}`);
});