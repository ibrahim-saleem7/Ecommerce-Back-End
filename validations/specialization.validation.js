const joi = require('joi');



class Specialization {

    static addSpecialization = joi.object({
        name : joi.string().required().trim().min(2).max(255),
        modules : joi.array().items(joi.string().trim()).required(),
        isActive : joi.boolean().required(),
    })

    static updateSpecialization = joi.object({
        name : joi.string().trim().min(2).max(255),
        // modules : joi.array().items(joi.string().trim()),
        isActive : joi.boolean(),
    })
    static updateSpecializationModules = joi.object({
        module : joi.string().trim().required(),
    })


}
    




module.exports = Specialization