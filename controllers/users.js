// PACKAGES
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// MODELS
const User = require("../models/user");

function generateConfrimToken(){
   return crypto.randomBytes(3).toString("hex");
}

async function sendSMS(number, text){
    await client.messages.create({
        body: text,
        from: process.env.TWILIO_NUMBER,
        to: number
    });
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
            // sendSMS(user.phoneNumber,  `Note app login token: ${token}`);
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
                    // sendSMS(user.phoneNumber, `Note app registration confrim token: ${user.accountConfirmationToken}`);
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
        let { user } = res.locals;
        const { username, currentPassword, password, passwordConfirm } = req.body;
        if(currentPassword.length){
            const currentUsername = user.username;
            const authObj = await User.authenticate()(currentUsername, currentPassword);
            user = authObj.user;
            if(user){
                user.username = username.length ? username : currentUsername;
                if(password.length || passwordConfirm.length){
                    if(!password.length){
                        return res.json({ err: "Missing new password" });
                    } else if(!passwordConfirm.length){
                        return res.json({ err: "Missing password confirmation" });
                    } else if(password!==passwordConfirm){
                        return res.json({ err: "Passwords not matching" });
                    } else {
                        await user.setPassword(password);
                    }
                }
                try {
                    await user.save();
                } catch(e) {
                    const { message } = e;
                    if(message.includes("duplicate key error collection") && message.includes("username_1 dup key")){
                        return res.json({ err: "username already taken" });
                    }
                    return res.json({ err: "something went wrong impossible updating" });
                }
                const token = jwt.sign(user.toObject(), process.env.JWT_KEY, { expiresIn: "2d" });
                return res.json({ token, user });
            }
            return res.json({ err: "Wrong password" });
        }
        return res.json({ err: "Missing current password" });
    },
    // start pwd reset procedure
    async postForgot(req, res, next){
        const { phoneNumber } = req.body;
        let user = await User.findOne({ phoneNumber });
        if(user){
            user.passwordResetToken = generateConfrimToken();
            user.passwordResetTokenExipire = Date.now()+3600000;
            await user.save();
            console.log(user.passwordResetToken);
            // sendSMS(user.phoneNumber, `Note app password reset token: ${user.passwordResetToken}`);
            return res.json({ code: 200 });
        }
        return res.json({ err : { message: "No users registered with the provided phone number" } });
        

    },
    async postForgotConfirm(req, res, next){
        const { token } = req.body;
        let user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExipire: {
                $gte: Date.now()
            }
        });
        if(user){
            return res.json({ code: 200 });
        }
        return res.json({ err: "Token invalid or expired" });
    },
    // start pwd reset procedure
    async putReset(req, res, next){
        const { password, passwordConfirm, userToken } = req.body;
        let user = await User.findOne({
            passwordResetToken: userToken
        });
        if(user){
            if(!password.length) return res.json({ err: "Missing password" });
            else if(!passwordConfirm.length) return res.json({ err: "Missing password confirmation" });
            else if(password!==passwordConfirm) return res.json({ err: "Passwords not matching" });
            else {
                await user.setPassword(password);
                user = await user.save();
                // sendSMS(user.phoneNumber, "Your password has been successfully reseted");
                const token = jwt.sign(user.toObject(), process.env.JWT_KEY, { expiresIn: "2d" });
                return res.json({ token, user });
            }
        }
        return res.json({ err: "something went wrong, the password reset cannot be completed" });
    }
}