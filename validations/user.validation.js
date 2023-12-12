const joi = require('joi');



class User {

    static addUser = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        email : joi.string().required().trim(),
        password : joi.string().required().trim().min(2).max(20),
        phone : joi.string().required().trim(),
        imageProfile : joi.any(),
        city : joi.string().required().trim().min(2).max(20),
        details : joi.string().required().min(2).max(255),
        postalCode : joi.string().trim().min(2).max(20),
    })

    static updateUser = joi.object({
        name : joi.string().trim().min(2).max(20),
        email : joi.string().trim(),
        password : joi.string().trim().min(2).max(20),
        phone : joi.string().trim(),
        imageProfile : joi.any(),
        city : joi.string().trim().min(2).max(20),
        details : joi.string().min(2).max(255),
        postalCode : joi.string().trim().min(2).max(20),
        
    })

    static addWishlist = joi.object({
        userId : joi.string().trim(),
        productId : joi.string().trim(),
        
    })
    static deleteWishlist = joi.object({
        userId : joi.string().trim(),
        productId : joi.string().trim(),
        
    })


}
    




module.exports = User