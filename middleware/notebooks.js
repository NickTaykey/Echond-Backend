const Notebook = require("../models/notebook");

module.exports = {
    async checkIfNotebookExists(req, res, next){
        const { id } = req.params;
        try{
            let notebook = await Notebook.findById(id)
                .populate("notes")
                .exec();
            if(notebook) {
                res.locals.notebook = notebook;
                return next();
            }
            return res.json({ code: 404, resource: "Notebook" });
        } catch(e){
            return res.json({ code: 404, resource: "Notebook" });
        }
    }
}