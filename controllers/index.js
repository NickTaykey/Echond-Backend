const Note = require("../models/note");
const Notebook = require("../models/notebook");

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}

module.exports = {
    async search(req, res, next){
        const { search } = req.query;
        const { user } = res.locals;
        if(search){
            const escapedQuery = escapeRegExp(search);
            const regex = new RegExp(escapedQuery, "gi");
            let notes = await Note.find({ body: regex, author: user._id });
            let notebooks = await Notebook.find({ title: regex, author: user._id });
            return res.json({ notes, notebooks });
        }
    }
};  