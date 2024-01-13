const joi = require('joi');



class Intake {

    static addIntake = joi.object({
        name : joi.string().required().trim().min(2).max(20),
        slot : joi.string().required().trim(),
        programList : joi.array().required(),
        studentsList : joi.array().required(),
        instructorsList : joi.array().required(),
        status : joi.string().required(),
        comment : joi.string(),
        isActive : joi.boolean().required(),
        // createdBy : joi.string().required().trim(),
    })

    static updateIntake = joi.object({
        name : joi.string().trim().min(2).max(20),
        slot : joi.string().trim(),
        status : joi.string(),
        comment : joi.string(),
        isActive : joi.boolean(),
        // updatedBy :joi.string().required().trim(),
    })


    static studentAssignToIntake = joi.object({
        studentId : joi.string().trim().required(),
        comment : joi.string().trim().required(),
        // assignBy : joi.string().trim().required(),
        
    })

    static transferStudent = joi.object({
        intakeId : joi.string().trim().required(),
        studentId : joi.string().trim().required(),
        comment : joi.string().trim().required(),
        // updateBy : joi.string().trim().required(),
        
    })

    static removeInstructor = joi.object({
        // comment : joi.string().trim().required(),
        instructorId : joi.string().trim().required(),
        
    })
    static removeStudent = joi.object({
        comment : joi.string().trim().required(),
        studentId : joi.string().trim().required(),
        
    })


    static instructorAssignToIntake = joi.object({
        moduleInstructor : joi.string().trim().required(),
        moduleName : joi.string().trim().required(),
        moduleCorrector : joi.string().trim().required(),
        // assignBy : joi.string().required().trim(),
        
    })

    static updateInstructorIntake = joi.object({
        moduleInstructor : joi.string().trim().required(),
        moduleName : joi.string().trim().required(),
        moduleCorrector : joi.string().trim().required(),
        instructorIndex : joi.string().trim().required(),
        // assignBy : joi.string().required().trim(),
        
    })

    // static updateStudentInIntake = joi.object({
    //     moduleName : joi.string().trim().required(),
    //     moduleAssignment : joi.object({
    //         assignmentStatus : joi.string().trim().required(),
    //         assignmentDeadline : joi.date(),
    //         assignmentDate : joi.date(),
    //     }).required(),
    //     updateBy: joi.string().trim().required()
            
    // })

    // static updateInstructorInIntake = joi.object({
    //     moduleName : joi.string().trim().required(),
    //     moduleCorrector : joi.string().required(),
    //     updateBy: joi.string().trim().required()

    // })



}
    




module.exports = Intake