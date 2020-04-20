const Note = require("../models/note");
const Notebook = require("../models/notebook");

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}

module.exports = {
    async search(req, res, next){
        const { search } = req.query;
        if(search){
            const escapedQuery = escapeRegExp(search);
            const regex = new RegExp(escapedQuery, "gi");
            let notes = await Note.find({ body: regex });
            let notebooks = await Notebook.find({ title: regex });
            return res.json({ notes, notebooks });
        }
    }
};  