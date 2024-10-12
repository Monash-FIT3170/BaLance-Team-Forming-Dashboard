const { auth } = require('express-oauth2-jwt-bearer');
const axios = require('axios');

// Function to retrieve user details from Auth0 using the access token in the request
async function getUserDetails(req) {
    const accessToken = req.auth.token;
        const userResponse = await axios.get(process.env.AUTH_DOMAIN+ 'userinfo',
        {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })

        return userResponse.data;
}

// Function to delay execution for a specified amount of time
async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


// Middleware function to handle JWT verification and user info retrieval for Auth0
const auth0Middleware = (app) => {
    const verifyJwt = auth({
        audience: 'balance-api-endpoint',
        issuerBaseURL: process.env.AUTH_DOMAIN,
        tokenSigningAlg: 'RS256'
      });
    
    app.use(verifyJwt);

    // Middleware to retrieve user details and handle retries on failure
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

module.exports = {
    auth0Middleware
};