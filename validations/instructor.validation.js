const joi = require('joi');



class Instructor {

    static addInstructor = joi.object({
        fullName : joi.string().required().trim().min(9).max(100),
        firstName : joi.string().required().trim().min(2).max(20),
        lastName : joi.string().required().trim().min(2).max(20),
        phoneNumber : joi.string().required().trim(),
        personalEmail : joi.string().required().trim(),
        businessEmail : joi.string().trim().optional(),
        specializationList : joi.any().required(),
        // contract : joi.any(),
        status : joi.string().required(),
        comment : joi.string(),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateInstructor = joi.object({
        fullName : joi.string().trim().min(9).max(100),
        firstName : joi.string().trim().min(2).max(20),
        lastName : joi.string().trim().min(2).max(20),
        phoneNumber : joi.string().trim(),
        personalEmail : joi.string().trim(),
        businessEmail : joi.string().trim().optional(),
        contract : joi.any(),
        status : joi.string(),
        comment : joi.string(),
        isActive : joi.boolean(),
        // updatedBy :joi.string().trim().required(),
    })

    static updateSpecializationInstructor = joi.object({
        specialization : joi.string().trim().required(),
    })




}
    




module.exports = Instructor