// MODELS
const User = require("../models/user");
const Note = require("../models/note");

module.exports = {
    // retrieve all the current users' notes
    async noteIndex(req, res, next){
        res.json({ code: 200 });
    },
    // create a new note and return it
    async noteCreate(req, res, next){
        res.json({ code: 200 });
    },
    // update a note and return it
    async noteUpdate(req, res, next){
        res.json({ code: 200 });
    },
    // destroy a note
    async noteDestroy(req, res, next){
        res.json({ code: 200 });
    }
}