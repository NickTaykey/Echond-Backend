const Note = require("../models/note");

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}

module.exports = {
    // setup the query for index to filter, search or retrieve notes
    searchAndFilter(req, res, next){
        const { search } = req.query;
        let dbQuery = {};
        if(search){
            const escapedQuery = escapeRegExp(search);
            dbQuery = {
                body: new RegExp(escapedQuery, "gi")
            }
        } 
        res.locals.dbQuery = dbQuery;
        next();
    }
}