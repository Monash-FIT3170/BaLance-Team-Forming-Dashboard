const { auth } = require('express-oauth2-jwt-bearer');
const axios = require('axios');


async function getUserDetails(req) {
    const accessToken = req.auth.token;
        const userResponse = await axios.get(process.env.AUTH_DOMAIN+ '/userinfo',
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



const auth0Middleware = (app) => {
    const jwtCheck = auth({
        audience: 'https://balance-api-endpoint',
        issuerBaseURL: 'https://balancedev.au.auth0.com/',
        tokenSigningAlg: 'RS256'
      });
    
    app.use(jwtCheck, (req, res, next) => {
        next();
    });
    
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
    app.use((req, res, next) => {
        console.log('User info after authentication:',req.user);
        next();
    });
}

module.exports = {
    auth0Middleware
};