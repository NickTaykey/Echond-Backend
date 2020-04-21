const Note = require("../models/note");

module.exports = {
    async checkIfNoteExists(req, res, next){
        const { id } = req.params;
        let note = await Note.findById(id);
        if(note) {
            res.locals.note = note;
            return next();
        }
        res.json({ err: "404 note not found" });
    }
}