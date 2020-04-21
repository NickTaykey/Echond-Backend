const Notebook = require("../models/notebook");
const Note = require("../models/note");

module.exports = {
    // retrieve all the notebooks of the current user
    async notebookIndex(req, res, next){
        const author = req.user._id;
        let notebooks = await Notebook.find({ author })
                .populate("notes")
                .exec();
        res.json({ notebooks });
    },
    // create a notebook
    async notebookCreate(req, res, next){
        const { title } = req.body;
        const author = req.user._id;
        let notebook = await Notebook.create({ title, author });
        res.json({ notebook });
    },
    // update a notebook
    async notebookUpdate(req, res, next){
        const { title } = req.body;
        const { notebook } = res.locals;
        notebook.title = title;
        await notebook.save();
        res.json({ notebook });
    },
    // delete a notebook
    async notebookDestroy(req, res, next){
        const { notebook } = res.locals;
        // remove all the associated notes
        const { notes } = notebook;
        for(let note of notes){
            await Note.findByIdAndRemove(note.id);
        }
        await notebook.remove();
        res.json({ notebook });
    },
}