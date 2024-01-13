const joi = require('joi');



class Sales {

    static addSales = joi.object({
        name : joi.string().required().trim().min(2).max(50),
        email : joi.string().required().trim(),
        phone : joi.string().required().trim(),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateSales = joi.object({
        name : joi.string().trim().min(2).max(50),
        email : joi.string().trim(),
        phone : joi.string().trim(),
        isActive : joi.boolean().required(),
        // updatedBy : joi.string().required().trim(),        
    })
}
    




module.exports = Sales