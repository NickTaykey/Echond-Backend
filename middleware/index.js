module.exports = {
    // general porpuse async error handler
    asyncErrorHandler(fun){
        return (req, res, next)=>{
            Promise.resolve(fun(req, res, next))
                .catch(next);
        }
    }
}