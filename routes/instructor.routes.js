const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const InstructorController = require('../controllers/instructor.controller')
const InstructorValidation = require('../validations/instructor.validation')
const fileUpload = require('../utils/fileUpload');




router  // /api/v1/instructor
    .route("/")
    .get(Token.verifyToken,InstructorController.getAllInstructor)
    .post(Token.authAdmin(['gm' ,'ad']),fileUpload('contract'),validation(InstructorValidation.addInstructor),
                                                                            InstructorController.addInstructor)


// /api/v1/updateSpecializationInstructor/:id
router.put('/updateSpecializationInstructor/:id',Token.verifyToken,validation(InstructorValidation.updateSpecializationInstructor),
                                                                                InstructorController.updateSpecializationInstructor)

// /api/v1/instructor/:id
router
    .route('/:id')
    .get(Token.verifyToken,InstructorController.getInstructorById)
    .delete(Token.authAdmin(['gm' ,'ad']),InstructorController.deleteInstructorById)
    .put(Token.authAdmin(['gm' ,'ad']),fileUpload('contract'),validation(InstructorValidation.updateInstructor),
                                                                                                InstructorController.updateInstructor)






module.exports = router