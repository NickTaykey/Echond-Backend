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
        const notebookId = req.params.id;
        let notebook = await Notebook.findById(notebookId)
            .populate("notes")
            .exec();
        notebook.title = title;
        await notebook.save();
        res.json({ notebook });
    },
    // delete a notebook
    async notebookDestroy(req, res, next){
        const notebookId = req.params.id;
        let notebook = await Notebook.findByIdAndRemove(notebookId);
        // remove all the associated notes
        const notes = notebook.notes;
        for(let i = 0; i<notes.length; i++){
            const id = notes[i];
            await Note.findByIdAndRemove(id);
        }
        res.json({ notebook });
    },
}