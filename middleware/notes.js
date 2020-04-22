const Note = require("../models/note");

module.exports = {
    async checkIfNoteExists(req, res, next){
        const { id } = req.params;
        try{
            let note = await Note.findById(id);
            if(note) {
                res.locals.note = note;
                return next();
            }
            return res.json({ code: 404, resource: "Note" });
        } catch(e){
            return res.json({ code: 404, resource: "Note" });
        }
    }
}