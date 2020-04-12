/* 
Note (single note):

- body String
- pointed Boolean
- author ObjectId
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    body: String,
    pointed: Boolean,
    author: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports =  mongoose.model("Note", noteSchema);