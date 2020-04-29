// MODELS
const User = require("../models/user");
const Note = require("../models/note");

module.exports = {
    // check if the user is logged in
    async isLoggedIn(req, res, next){
        const { userId } = req.params;
        let user = await User.findById(userId);
        if(user){
            res.locals.user = user;
            next();
        } else {
            res.json({ err: "You have to be logged in to do that" });
        }
    },
    // check if the current user owns the note
    async checkUserNoteOwnerShip(req, res, next){
        next();
    },
    // check if the current user owns the account he wants to update
    async checkUserAccountOwnerShip(req, res, next){
        next();
    },
}