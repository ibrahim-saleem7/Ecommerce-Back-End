const { rateLimit } = require('express-rate-limit')


function limiter(limit, skipSuccessful){
    return rateLimit({
    
        windowMs : 60 * 60 * 1000,
        max : limit,
        handler: (req, res) =>{
            res.status(429).json({
                message : `You finished the Number of adapters , you can try again later after an hour`,
                })
    
        },
        requestWasSuccessful: (req, res) => res.statusCode < 400,
        skipSuccessfulRequests : skipSuccessful,
    })
    
}



const limiterRequest = rateLimit({
    
    windowMs : 60 * 60 * 1000,
    max : 100,
    handler: (req, res) =>{
        res.status(429).json({
            message : `Too many request , you can try again later after an hour`,
            })

    },
    requestWasSuccessful: (req, res) => res.statusCode < 400,
    skipSuccessfulRequests : false,
})

module.exports = {limiter,limiterRequest}