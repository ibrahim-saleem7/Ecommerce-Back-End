const joi = require('joi');



class SubCategory {

    static addSubCategory = joi.object({
        name : joi.string().required().trim().min(2).max(32),
        category : joi.string().required().trim(),
    })

    static updateSubCategory = joi.object({
        name : joi.string().trim().min(2).max(20),
        category : joi.string().trim(),
    })


}
    




module.exports = SubCategory