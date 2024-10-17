const { auth } = require('express-oauth2-jwt-bearer');
const axios = require('axios');


async function getUserDetails(req) {
    /**
     * Fetches user details from Auth0 by making an API call to the /userinfo endpoint.
     * It extracts the access token from the request (req.auth.token) and uses it to authorize the API call.
     * 
     * @param {Object} req - Express request object which contains authentication information
     * @returns {Promise<Object>} - Returns a promise that resolves to user information
     */
    const accessToken = req.auth.token;
        const userResponse = await axios.get(process.env.AUTH_DOMAIN+ '/userinfo',
        {
            headers: {
                authorization: `Bearer ${accessToken}` // Passes the token in the Authorization header
            }
        })
        return userResponse.data; // Returns the user's details fetched from the Auth0 API
}

async function delay(time) {
    /**
     * Delays execution for a specified amount of time using setTimeout wrapped in a Promise.
     * 
     * @param {number} time - Time in milliseconds to delay
     * @returns {Promise} - A promise that resolves after the specified delay
     */
    return new Promise(resolve => setTimeout(resolve, time));
}



const auth0Middleware = (app) => {
    /**
     * Middleware for Express that integrates Auth0 authentication.
     * It first verifies the JWT token using Auth0's express-oauth2-jwt-bearer and then attempts
     * to fetch user details from the /userinfo endpoint. If the first attempt fails, it retries
     * after a delay.
     * 
     * @param {Object} app - The Express application object
     */
    
    const jwtCheck = auth({ // Step 1: Setup JWT token validation using express-oauth2-jwt-bearer
        audience: 'https://balance-api-endpoint', // Expected audience of the token
        issuerBaseURL: 'https://balancedev.au.auth0.com/', // Issuer URL for Auth0
        tokenSigningAlg: 'RS256' // Algorithm used to sign the token
      });
    
    app.use(jwtCheck, (req, res, next) => {// Step 2: Add JWT check middleware to the app
        next(); // Pass the request to the next middleware if token is valid
    });
    
    app.use(async (req, res, next) => { // Step 3: Middleware to fetch and attach user details to the request
        try {
            req.user = await getUserDetails(req); // Fetch user details and attach to req.user
            next(); // Proceed to next middleware or route handler
        }
        catch(err){
            try { // Step 4: Retry fetching user details after a 10-second delay if the first attempt fails
                await delay(10000); // Wait for 10 seconds
                req.user = await getUserDetails(req) // Retry fetching user details
                next(); // Proceed to next middleware or route handler
            }
            catch(err){
                return res.sendStatus(500); // Send a 500 error if retry also fails
            }
        }
    })
}

module.exports = {
    auth0Middleware // Export the auth0Middleware function for use in other modules
};