// PACKAGES
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// MODELS
const User = require("../models/user");

function generateConfrimToken(){
   return crypto.randomBytes(4).toString("hex");
}

module.exports = {
    // login a user
    async postLogin(req, res, next){
        const { username, password } = req.body;
        const { user } = await User.authenticate()(username, password);
        if(user && !user.accountConfirmationToken){
            // generate random bytes
            const token = generateConfrimToken();
            const expires = Date.now()+3600000;
            // set token and expire in the DB
            user.twoFactorAuthToken = token;
            user.twoFactorAuthTokenExipre = expires;
            // save
            await user.save();
            // send sms
            console.log(token);
            await client.messages.create({
                body: `Note app login token: ${token}`,
                from: process.env.TWILIO_NUMBER,
                to: user.phoneNumber
              });
            return res.json({ code: 200 });
        }
        return res.json({ error: { message : "username or password not correct" } });
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
        const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;
        const { username, password, passwordConfirm, phoneNumber } = req.body;
        let errMsg = "Missing ";
        if(!username) errMsg+="username, ";
        if(!password) errMsg+="password, ";
        if(!passwordConfirm) errMsg+="Password confirmation, ";
        if(!phoneNumber) errMsg+="Phone Number, ";

        if(errMsg!=="Missing "){
            return res.json({ err: errMsg.slice(0, errMsg.length - 2) });   
        } else {
            if(password!==passwordConfirm){
                return res.json({ err: "Passwords not matching" });   
            } else if(!phoneNumberRegex.exec(phoneNumber)){
                return res.json({ err: "Phone number not valid" });   
            } else {
                let user = await User.findOne({ phoneNumber });
                if(user){
                    return res.json({ err: { message: "A user with the provided phone number is already registered" } });
                } else {
                    let user = await User.register(
                        { 
                            username, 
                            phoneNumber,  
                            accountConfirmationToken : generateConfrimToken()
                        }, 
                        password
                    );
                    console.log(user.accountConfirmationToken);
                    await client.messages.create({
                        body: `Note app registration confrim token: ${user.accountConfirmationToken}`,
                        from: process.env.TWILIO_NUMBER,
                        to: user.phoneNumber
                    });
                    return res.json({ code: 200 });
                }
            }
        }
    },
    // verify phone number when registering the account
    async postRegisterConfirm(req, res, next){
        const { token } = req.body;
        let user = await User.findOne({ accountConfirmationToken: token });
        if(user){
            user.accountConfirmationToken = undefined;
            user = await user.save();
            const token = jwt.sign(user.toObject(), process.env.JWT_KEY, { expiresIn: "2d" });
            return res.json({ user, token });
        }
        return res.json({ err: "Token not valid" });
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