// MODELS
const User = require("../models/user");

module.exports = {
    // login a user
    async postLogin(req, res, next){
        const { username, password } = req.body;
        let user = await User.authenticate()(username, password);
        res.json({ user });
    },
    // logout the current user
    async getLogout(req, res, next){
        await req.logout();
        res.json({ code: 200 });
    },
    // register a user
    async postRegister(req, res, next){
        const { username, email, password } = req.body;
        let user = await User.register({ username, email }, password);
        await User.authenticate()(username, password);
        res.json({ user });
    },
    // get a user's profile
    async getProfile(req, res, next){
        res.json({ code: 200 });
    },
    // update a user's profile
    async putProfile(req, res, next){
        res.json({ code: 200 });
    },
    // start pwd reset procedure
    async postForgot(req, res, next){
        res.json({ code: 200 });
    },
    // start pwd reset procedure
    async putReset(req, res, next){
        res.json({ code: 200 });
    }
}