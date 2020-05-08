// PACKAGES
const jwt = require("jsonwebtoken");

module.exports = {
    // check if the user is logged in
    async isLoggedIn(req, res, next){
        const { JWTtoken } = req.params;
        const err = "You have to be logged in to do that";
        if(JWTtoken){
            try{
                const user = jwt.verify(JWTtoken, process.env.JWT_KEY);
                res.locals.user = user;
                return next();
            } catch(e){
                return res.json({ err });
            }
        }
        return res.json({ err });
    },
}