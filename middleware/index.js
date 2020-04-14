module.exports = {
    // general porpuse async error handler
    asyncErrorHandler(fun){
        return (req, res, next)=>{
            Promise.resolve(fun(req, res, next))
                .catch(next);
        }
    },
    // check if the current request is from the client-side app
    validateRequest(req, res, next){
        const { origin } = req.headers;
        if(origin && origin===process.env.CLIENT_URL) 
            return next();
        res.send("<h1>403 Forbiden</h1>");
    }
}