const express = require('express');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');
const studentRoutes = require('./routes/students');
const cors = require('cors');
//const { expressjwt: jwt } = require('express-jwt');
const { auth } = require('express-oauth2-jwt-bearer');
const jwks = require('jwks-rsa');
const axios = require('axios');
const db_connection = require("./config/databaseConfig");

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

const verifyJwt = auth({
    audience: 'balance-api-endpoint',
    issuerBaseURL: 'https://balance.au.auth0.com/',
    tokenSigningAlg: 'RS256'
  });

app.use(verifyJwt);

app.use(async (req, res, next) => {
    try {
        const accessToken = req.auth.token;
        const userResponse = await axios.get('https://balance.au.auth0.com/userinfo',
        {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })

        req.user = userResponse.data;
    }
    catch(err){
        console.log(err);
    }
    next();
})

app.use(async (req, res, next) => {

    results = await db_connection.promise().query(
        `SELECT * FROM staff WHERE email_address='${req.user.email}';`
    );

    if (results[0].length == 0){

        await db_connection.promise().query(
            `INSERT INTO staff (staff_code, preferred_name, last_name, email_address)
            VALUES ('${req.user.nickname}', '${req.user.nickname}', '${req.user.nickname}', '${req.user.email}');
            `
        )

    }
    next();
})

// route middleware
app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);
app.use('/api/students/', studentRoutes);

// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT || 8080}`);
});