
function notFond (req, res, next) {
    const error = new Error(`Not Found : ${req.originalUrl}`)
    res.status(404)
    next(error)
}

function errorHandler (err ,req, res, next) {
    res.status(res.statusCode).json({message : err.message})
}

module.exports = {
        notFond,
        errorHandler
}