const express = require('express');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');
const studentRoutes = require('./routes/students');
const analyticsRoutes = require('./routes/analytics')
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
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// if (process.env.AUTH == "TEST") { auth0Middleware(app); }
// if (process.env.AUTH == "DEV" || process.env.AUTH == null) { mockAuthMiddleware(app); }

// app.use(async (req, res, next) => {
//     results = await db_connection.promise().query(`SELECT * FROM staff WHERE email_address='${req.user.email}';`);
//     if (results[0].length === 0) {
//         await db_connection.promise().query(
//             `INSERT INTO staff (preferred_name, last_name, email_address)
//             VALUES ('${req.user.nickname}', '${req.user.nickname}', '${req.user.email}');`
//         )
//     }
//     next();
// })

app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);
app.use('/api/students/', studentRoutes);
app.use('/api/analytics/', analyticsRoutes)

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`listening to port ${process.env.PORT}`);
});