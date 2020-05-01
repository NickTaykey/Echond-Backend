// PACKAGES
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// MODELS
const User = require("../models/user");

module.exports = {
    // login a user
    async postLogin(req, res, next){
        const { username, password } = req.body;
        const { user } = await User.authenticate()(username, password);
        // generate random bytes
        const token = crypto.randomBytes(4).toString("hex");
        const expires = Date.now()+3600000;
        // set token and expire in the DB
        user.twoFactorAuthToken = token;
        user.twoFactorAuthTokenExipre = expires;
        // save
        await user.save();
        // send sms
        await client.messages.create({
            body: `Note app login token: ${token}`,
            from: process.env.TWILIO_NUMBER,
            to: user.phoneNumber
          });
        res.json({ code: 200 });
    },
    async postLoginConfirm(req, res, next){
        const { token } = req.body;
        let user = await User.findOne(
                { 
                    twoFactorAuthToken: token, 
                    twoFactorAuthTokenExipre: { $gte: Date.now() } 
                }
            );
        if(user){
            user.twoFactorAuthToken = undefined;
            user.twoFactorAuthTokenExipre = undefined;
            await user.save();
            // generate JSON web token
            const token = jwt.sign(user.toObject(), process.env.JWT_KEY, { expiresIn: "2d" });
            return res.json({user, token});
        }
        return res.json({ err: "token not valid or expired" });
    },
    // register a user
    async postRegister(req, res, next){
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
        const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/gi;
        const { username, email, password, passwordConfirm, phoneNumber } = req.body;
        let errMsg = "Missing ";
        if(!username) errMsg+="username, ";
        if(!email) errMsg+="E-mail, ";
        if(!password) errMsg+="password, ";
        if(!passwordConfirm) errMsg+="Password confirmation, ";
        if(!phoneNumber) errMsg+="Phone Number, ";

        if(errMsg!=="Missing "){
            return res.json({ err: errMsg.slice(0, errMsg.length - 2) });   
        } else {
            if(password!==passwordConfirm){
                return res.json({ err: "Passwords not matching" });   
            } else if(!emailRegex.exec(email)){
                return res.json({ err: "E-mail address not valid" });   
            } else if(!phoneNumberRegex.exec(phoneNumber)){
                return res.json({ err: "Phone number not valid" });   
            } else {
                let user = await User.register({ username, email }, password);
                user.phoneNumber = phoneNumber;
                await user.save();
                 // generate JSON web token
                const token = jwt.sign(user.toObject(), process.env.JWT_KEY, { expiresIn: "2d" });
                res.json({token, user});
            }
        }
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