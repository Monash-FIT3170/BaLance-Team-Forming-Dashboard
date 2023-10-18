
const mockAuthMiddleware = (app) => {

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

module.exports = {
    mockAuthMiddleware
};