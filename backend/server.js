const express = require('express');
const unitRoutes = require('./routes/units');
const groupRoutes = require('./routes/groups');
const studentRoutes = require('./routes/students');
const analyticsRoutes = require('./routes/analytics')
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

const app = express();

// required to attach reqs with a body to the req object for req handling
app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

if (process.env.AUTH == "TEST"){
    const verifyJwt = auth({
        audience: 'balance-api-endpoint',
        issuerBaseURL: process.env.AUTH_DOMAIN,
        tokenSigningAlg: 'RS256'
      });

    app.use(verifyJwt);


    async function getUserDetails(req) {
        const accessToken = req.auth.token;
            const userResponse = await axios.get('https://balance.au.auth0.com/userinfo',
            {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })

            return userResponse.data;
    }

    async function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    app.use(async (req, res, next) => {
        try {
            req.user = await getUserDetails(req);
            next();
        }
        catch(err){
            try {
                await delay(10000);
                req.user = await getUserDetails(req)
                next();
            }
            catch(err){
                return res.sendStatus(500);
            }
        }
    })
}

if (process.env.AUTH == "DEV"){
    app.use((req, res, next) =>{
        if (req.get('authorization') != "Bearer 0000"){
            return res.sendStatus(401);
        }

        req.user = {
            email: "test_user@monash.edu",
            nickname: "tuse0001"
        };
        next(); 
    })
}

app.use(async (req, res, next) => {
    results = await db_connection.promise().query(
        `SELECT * FROM staff WHERE email_address='${req.user.email}';`
    );

    if (results[0].length == 0){
        await db_connection.promise().query(
            `INSERT INTO staff (staff_code, preferred_name, last_name, email_address)
            VALUES ('${req.user.nickname}', '${req.user.nickname}', '${req.user.nickname}', '${req.user.email}');`
        )
    }
    next();
})

// route middleware
app.use('/api/units/', unitRoutes);
app.use('/api/groups/', groupRoutes);
app.use('/api/students/', studentRoutes);
app.use('/api/analytics/',analyticsRoutes)

// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT || 8080}`);
});