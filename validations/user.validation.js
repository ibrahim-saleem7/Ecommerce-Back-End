const joi = require('joi');



class User {

    static addUser = joi.object({
        name : joi.string().required().trim().min(2).max(100),
        email : joi.string().required().trim(),
        password : joi.string().required().trim().min(8),
        role : joi.string().required().min(2).max(255),
    })

    static updateUser = joi.object({
        name : joi.string().trim().min(2).max(100),
        email : joi.string().trim(),
        password : joi.string().trim().min(8),
        role : joi.string().min(2).max(255),
        isDeleted : joi.boolean(),
        
    })

}
    




module.exports = User