const joi = require('joi');



class Brand {

    static addBrand = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        image : joi.any()
    })

    static updateBrand = joi.object({
        name : joi.string().trim().min(2).max(20),
        image : joi.any(),
        
    })


}
    




module.exports = Brand