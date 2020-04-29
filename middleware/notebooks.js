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
    },
    async checkNotebookOwnership(req, res, next){
        const { user, notebook } = res.locals;
        if(notebook.author.equals(user._id)){
            return next();
        }
        return res.json({ code: 403, resource: "Notebook" });
   }
}