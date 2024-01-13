const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const IntakeController = require('../controllers/intake.controller')
const IntakeValidation = require('../validations/intake.validation')




router  // /api/v1/intake
    .route("/")
    .get(Token.verifyToken,IntakeController.getAllIntakes)
    .post(Token.authAdmin(['gm','ad']),validation(IntakeValidation.addIntake),IntakeController.addIntake) 


// /api/v1/intake/studentAssign/:id
router.put("/studentAssign/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.studentAssignToIntake) ,
                                                                             IntakeController.studentAssignToIntake)

// /api/v1/intake/transferStudent/:id?studentId=
router.put("/transferStudent/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.transferStudent) , 
                                                                            IntakeController.transferStudentIntake)

// /api/v1/intake/removeStudent/:id?studentId=
router.put("/removeStudent/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.removeStudent) , 
                                                                            IntakeController.removeStudentIntake)

// /api/v1/intake/instructorAssign/:id
router.put("/instructorAssign/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.instructorAssignToIntake) , 
                                                                            IntakeController.instructorAssignToIntake)

router.put("/instructorUpdateIntake/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.updateInstructorIntake) , 
                                                                            IntakeController.instructorUpdateIntake)

// /api/v1/intake/removeInstructor/:id?instructorId=
router.put("/removeInstructor/:id",Token.authAdmin(['gm','ad']),validation(IntakeValidation.removeInstructor) , 
                                                                            IntakeController.removeInstructorIntake)

// /api/v1/intake/updateProgram/:id?programId=  &&operation=
router.put("/updateProgram/:id",Token.authAdmin(['gm','ad']),IntakeController.updateProgramIntake)



router  // /api/v1/intake/:id
    .route("/:id")
    .get(Token.verifyToken,IntakeController.getIntakeById)
    .put(Token.authAdmin(['gm','ad']),validation(IntakeValidation.updateIntake),IntakeController.updateIntake)
    .delete(Token.authAdmin(['gm']),IntakeController.deleteIntakeById)






module.exports = router










// // /api/v1/intake/instructorAssign/:id
// router.put("/instructorAssign/:id", validation(IntakeValidation.instructorAssignToIntake) ,IntakeController.instructorAssignToIntake)



// // /api/v1/intake/modifyStudentIntake/:id
// router.put("/modifyStudentIntake/:intakeId", validation(IntakeValidation.updateStudentInIntake), IntakeController.updateStudentInIntake)

// // /api/v1/intake/modifyInstructorIntake/:id
// router.put("/modifyInstructorIntake/:intakeId", validation(IntakeValidation.updateInstructorInIntake), IntakeController.updateStudentInIntake)