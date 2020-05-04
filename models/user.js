/*
User

- username String
- phone number String
- notes (ids Array) ObjectId Array
- friends (user ids Array) ObjectId Array
- profile image Object 
- sharedNotes (ids Array) ObjectId Array 
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    phoneNumber: String,
    friends: [ 
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    profile_img: { 
        secure_url: String, 
        public_id: String 
    },
    sharedNotes: [ 
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ],
    twoFactorAuthToken: String,
    twoFactorAuthTokenExipre: Number,
    accountConfirmationToken: String
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);