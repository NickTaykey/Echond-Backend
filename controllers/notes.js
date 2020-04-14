// MODELS
const User = require("../models/user");
const Note = require("../models/note");

module.exports = {
    // retrieve all the current users' notes
    async noteIndex(req, res, next){
        const { date } = req.query;
        const authorId = req.user._id;
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;
        let notes = await Note.find(dbQuery)
                    .sort(eval(date) ? "_id" : "-_id")
                    .where("author")
                    .equals(authorId)
                    .exec();
        res.json({ notes });
    },
    // create a new note and return it
    async noteCreate(req, res, next){
        let { body, pointed } = req.body;
        const author = req.user._id;
        pointed = pointed==="on" ? true : false;
        let note = await Note.create(
            {
                body,
                pointed,
                author
            }
        );
        res.json({ note });
    },
    // update a note and return it
    async noteUpdate(req, res, next){
        let { id } = req.params;
        let { body, pointed } = req.body;
        pointed = pointed ? true : false;
        let note = await Note.findByIdAndUpdate(
            id,
            {
                body,
                pointed
            },
            { new: true }
        );
        res.json({ note });
    },
    // destroy a note
    async noteDestroy(req, res, next){
        const { id } = req.params;
        let note = await Note.findByIdAndRemove(id);
        res.json({ note });
    }
}