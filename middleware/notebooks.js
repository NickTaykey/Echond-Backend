const Notebook = require("../models/notebook");

module.exports = {
    async checkIfNotebookExists(req, res, next){
        const { id } = req.params;
        let notebook = await Notebook.findById(id)
            .populate("notes")
            .exec();
        if(notebook) {
            res.locals.notebook = notebook;
            return next();
        }
        res.json({ err: "404 notebook not found" });
    }
}