
const mockAuthMiddleware = (app) => {
    /**
     * This middleware simulates an authentication process for testing purposes.
     * It checks if the 'authorization' header contains the token "Bearer 0000".
     * If the token is valid, it attaches a mock user to the request (req.user).
     * If not, it sends a 401 Unauthorized status.
     *
     * @param {Object} app - The Express application object
     */
    app.use((req, res, next) =>{ // Check if the authorization header contains the correct mock token
        if (req.get('authorization') != "Bearer 0000"){
            return res.sendStatus(401); // Respond with 401 Unauthorized if token is invalid
        }

        req.user = { // If token is valid, attach a mock user to the request
            email: "test_user@monash.edu", // Mock email for the user
            nickname: "tuse0001" // Mock nickname for the user
        };
        next(); // Proceed to the next middleware or route handler
    })
}

module.exports = {
    mockAuthMiddleware // Export the mockAuthMiddleware function for use in other modules
};