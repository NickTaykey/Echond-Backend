// MODELS
const User = require("../models/user");
const Note = require("../models/note");
const Notebook = require("../models/notebook");

module.exports = {
    // create a new note and return it
    async noteCreate(req, res, next){
        let { body, pointed, notebookTitle } = req.body;
        const author = res.locals.user._id;
        pointed = pointed==="on" ? true : false;
        let note = await Note.create(
            {
                body,
                pointed,
                author
            }
        );
        try{
            let notebook = await Notebook.findOne({ title: notebookTitle });
            if(notebook){
                notebook.notes.push(note);
                notebook = await notebook.save();
                notebook = await Notebook.findById(notebook._id)
                            .populate("notes")
                            .exec();
                return res.json({ note, notebook });
            }
            return res.json({code: 404, resource: "Notebook"});
        } catch(e){
            return res.json({code: 404, resource: "Notebook"});
        }
    },
    // update a note and return it
    async noteUpdate(req, res, next){
        let { body, pointed, notebookTitle } = req.body;
        pointed = pointed ? true : false;
        let { note } = res.locals;
        note.pointed = pointed;
        note.body = body;
        await note.save();
        try{
            // delete the note from the previous notebook
            let oldNotebook = await Notebook.findOne({ notes: { $elemMatch: { $eq: note._id } } });
            let notebook = await Notebook.findOne({ title: notebookTitle });
            if(notebook && oldNotebook){
                const index = oldNotebook.notes.indexOf(note._id);
                oldNotebook.notes.splice(index, 1);
                await oldNotebook.save();
                // add the note to the new notebook
                notebook.notes.push(note);
                await notebook.save();
                oldNotebook = await oldNotebook.populate("notes").execPopulate();
                notebook = await notebook.populate("notes").execPopulate();
                return res.json({ note, notebook, oldNotebook });
            }
            return res.json({code: 404, resource: "Notebook"});
        } catch(e){
            return res.json({code: 404, resource: "Notebook"});
        }
    },
    // destroy a note
    async noteDestroy(req, res, next){
        // delete the note
        let { note } = res.locals;
        await note.remove();
        try{
            // delete the note from the notebook it is associated which
            let notebook = await Notebook.findOne({ notes: { $elemMatch: { $eq: note._id } } });
            if(notebook){
                const index = notebook.notes.indexOf(note._id);
                notebook.notes.splice(index, 1);
                notebook = await notebook.save();
                return res.json({ note, notebook });
            }
            return res.json({code: 404, resource: "Notebook"});
        } catch(e){
            return res.json({code: 404, resource: "Notebook"});
        }
    }
}