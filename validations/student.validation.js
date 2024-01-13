const joi = require('joi');



class Student {

    static addStudent = joi.object({
        fullName : joi.string().required().trim().min(9).max(100),
        firstName : joi.string().required().trim().min(2).max(20),
        lastName : joi.string().required().trim().min(2).max(20),
        BDName : joi.string().required().trim(),
        OrgName : joi.string().required().trim(),
        phoneNumber : joi.string().required().trim(),
        personalEmail : joi.string().required().trim(),
        businessEmail : joi.string().trim(),
        programEnrolled : joi.array().required(),
        specialization : joi.array().required(),
        studentModules : joi.array().required(),
        studentFinancial:joi.object({
            paymentMethod : joi.string().required().trim(),
            // paid : joi.number().required(),
            reservation : joi.number().required(),
            numberOfInstallments : joi.number().required(),
            totalBill : joi.number().required(),
            installments : joi.array(),
        }).required(),
        status : joi.string().required().trim().min(2).max(90),
        comment : joi.string().trim().min(2).max(90),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim()
    })

    static updateInfoStudent = joi.object({
        fullName : joi.string().trim().min(9).max(100),
        firstName : joi.string().trim().min(2).max(20),
        lastName : joi.string().trim().min(2).max(20),
        BDName : joi.string().trim(),
        OrgName : joi.string().trim(),
        phoneNumber : joi.string().trim(),
        personalEmail : joi.string().trim(),
        businessEmail : joi.string().trim(),
        isActive : joi.boolean(),
        status : joi.string().trim().min(2).max(90),
        comment : joi.string().optional(),
    })

    static updateInstallment = joi.object({
        installmentNumber : joi.number().required(),
        installmentValue : joi.number().required(),
        installmentStatus : joi.string().required().valid('paid', 'not paid').trim(),
        installmentDate : joi.string().required().trim(),
        installmentCountry : joi.string().trim(),
       
               
    })
    static updateFinancialStudent = joi.object({
        studentFinancial : joi.object({
            numberOfInstallments : joi.number().required(),
            totalBill : joi.number().required(),
            installments : joi.array().required(),
            paid : joi.number().required(),
            paymentMethod : joi.string().required(),
            reservation : joi.number().required(),
        })
               
    })

    static attendee = joi.object({
            studentList : joi.array().required(),       
    })
    static addModule = joi.object({
            moduleName : joi.string().trim().required(),       
    })

    static updateSpecialization = joi.object({
            specialization : joi.string().trim().required(),       
    })
    static updateProgram = joi.object({
            program : joi.string().trim().required(),       
    })

    static updateModules = joi.object({
        // moduleName : joi.string().trim().required(),       
        moduleAssignment : joi.object({
            assignmentStatus: joi.string().trim().required(),
            assignmentScore: joi.number().min(0).max(100),
            assignmentDeadline: joi.string().trim(),
            assignmentDate: joi.string().trim(),
        }).required(),       
    })


}
    




module.exports = Student