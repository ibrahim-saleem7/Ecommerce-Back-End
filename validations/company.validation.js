const joi = require('joi');



class Company {

    static addCompany = joi.object({
        name : joi.string().required().trim().min(2).max(255),
        address : joi.string().required().trim(),
        phoneNumbers : joi.array().required(),
        email : joi.string().required().trim(),
        companyField : joi.string().required().trim(),
        numberOfEmployees : joi.number().required(),
        BDName : joi.string().required().trim(),
        programs : joi.array().required(),
        representativeOfCompany : joi.array().required(),
        status : joi.string().required().trim(),
        comment : joi.string(),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateCompany = joi.object({
        name : joi.string().trim().min(2).max(255),
        address : joi.string().trim(),
        phoneNumbers : joi.array(),
        email : joi.string().trim(),
        companyField : joi.string().trim(),
        numberOfEmployees : joi.number(),
        BDName : joi.string().trim(),
        status : joi.string().trim(),
        comment : joi.string(),
        isActive : joi.boolean(),
    })

    static updateProgram = joi.object({
        program : joi.string().trim().required(),
        price : joi.number().required(),
    })

    static updatedRepresentative = joi.object({
        name : joi.string().trim().required(),
        phoneNumber : joi.string().required().trim(),
        position : joi.string().required().trim(),
        email : joi.string().required().email(),
    })




}
    




module.exports = Company