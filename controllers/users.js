// MODELS
const User = require("../models/user");

module.exports = {
    // login a user
    async postLogin(req, res, next){
        res.json({ code: 200 });
    },
    // register a user
    async postRegister(req, res, next){
        res.json({ code: 200 });
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