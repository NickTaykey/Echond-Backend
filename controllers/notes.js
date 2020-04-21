// MODELS
const User = require("../models/user");
const Note = require("../models/note");
const Notebook = require("../models/notebook");

module.exports = {
    // create a new note and return it
    async noteCreate(req, res, next){
        let { body, pointed, notebookTitle } = req.body;
        const author = req.user._id;
        pointed = pointed==="on" ? true : false;
        let note = await Note.create(
            {
                body,
                pointed,
                author
            }
        );
        let notebook = await Notebook.findOne({ title: notebookTitle });
        notebook.notes.push(note);
        notebook = await notebook.save();
        notebook = await Notebook.findById(notebook._id)
                    .populate("notes")
                    .exec();
        res.json({ note, notebook });
    },
    // update a note and return it
    async noteUpdate(req, res, next){
        let { id } = req.params;
        let { body, pointed, notebookTitle } = req.body;
        pointed = pointed ? true : false;
        let note = await Note.findByIdAndUpdate(
            id,
            {
                body,
                pointed
            },
            { new: true }
        );
        // delete the note from the previous notebook
        let oldNotebook = await Notebook.findOne({ notes: { $elemMatch: { $eq: note._id } } });
        const index = oldNotebook.notes.indexOf(note);
        oldNotebook.notes.splice(index, 1);
        await oldNotebook.save();
        // add the note to the new notebook
        let notebook = await Notebook.findOne({ title: notebookTitle });
        notebook.notes.push(note);
        await notebook.save();
        res.json({ note, notebook, oldNotebook });
    },
    // destroy a note
    async noteDestroy(req, res, next){
        const { id } = req.params;
        // delete the note
        let note = await Note.findByIdAndRemove(id);
        // delete the note from the notebook it is associated which
        let notebook = await Notebook.findOne({ notes: { $elemMatch: { $eq: note._id } } });
        const index = notebook.notes.indexOf(note._id);
        notebook.notes.splice(index, 1);
        notebook = await notebook.save();
        res.json({ note, notebook });
    }
}