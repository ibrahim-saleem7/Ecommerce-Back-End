const  jwt  = require("jsonwebtoken")
const AppError = require("./appError")

module.exports = emailAuth = (req, res, next)=> {
    const {token}= req.params
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded)=>{
        if(err) return next(new AppError(err, 400))
        
        req.email = decoded.email
        next()
    })
}