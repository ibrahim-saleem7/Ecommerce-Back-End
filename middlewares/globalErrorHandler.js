const uploadError = require('../utils/uploadError')


module.exports = globalErrorHandler = (error, req, res, next)=>{
    if (process.env.NODE_ENV== "development") developmentMode(error,req, res)
    else productionMode(error,req, res)
}

const developmentMode = (error,req, res)=>{
    const code = error.statusCode || 400
    uploadError(req)
    res.status(code).json({error:error.message, statusCode: code, stack: error.stack})
}

const productionMode = (error,req, res)=>{
    const code = error.statusCode || 400
    uploadError(req)
    res.status(code).json({error:error.message, statusCode: code})
}