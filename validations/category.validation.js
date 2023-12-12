const joi = require('joi');



class Category {

    static addCategory = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        image : joi.any()
    })

    static updateCategory = joi.object({
        name : joi.string().trim().min(2).max(20),
        image : joi.any()
    })


}
    




module.exports = Category