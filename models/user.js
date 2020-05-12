/*
User

- username String
- phone number String
- notes (ids Array) ObjectId Array
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    phoneNumber: String,
    twoFactorAuthToken: String,
    twoFactorAuthTokenExipre: Number,
    accountConfirmationToken: String,
    passwordResetToken: String,
    passwordResetTokenExipire: Number
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);