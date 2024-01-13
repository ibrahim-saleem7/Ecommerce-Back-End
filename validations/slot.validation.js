const joi = require('joi');



class Slot {

    static addSlot = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        days : joi.array().items(joi.string().required().trim()).required(),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateSlot = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        days : joi.array().items(joi.string().required().trim()).required(),
        isActive : joi.boolean().required(),
        // updatedBy : joi.string().required().trim(),        
    })


}
    




module.exports = Slot