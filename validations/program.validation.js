const joi = require('joi');



class Program {

    static addProgram = joi.object({
        name : joi.string().required().trim().min(2).max(255),
        specialization : joi.string().trim().required(),
        programAbbreviation : joi.string().trim().required(),
        isActive : joi.boolean().required(),
        // price: joi.number().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateProgram = joi.object({
        name : joi.string().required().trim().min(2).max(255),
        specialization : joi.string().trim(),
        programAbbreviation : joi.string().trim(),
        isActive : joi.boolean(),
        // price: joi.number()
        // updatedBy : joi.string().required().trim(),

    })


}
    




module.exports = Program