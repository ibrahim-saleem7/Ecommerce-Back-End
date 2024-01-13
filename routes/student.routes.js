const router = require('express').Router() 

const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const StudentController = require('../controllers/student.controller')
const StudentValidation = require('../validations/student.validation')




router  // /api/v1/student
    .route("/")
    .get(Token.verifyToken,StudentController.getAllStudents)
    .post(Token.authAdmin('gm','ad'),validation(StudentValidation.addStudent),StudentController.addStudent)

// /api/v1/student/updateInfoStudent/:id
router.put('/updateInfoStudent/:id',Token.authAdmin('gm','ad'),validation(StudentValidation.updateInfoStudent),
                                                                                StudentController.updateInfoStudent)


// /api/v1/student/updateInstallment/:id
router.put('/updateInstallment/:id',Token.authAdmin('gm','fi'),validation(StudentValidation.updateInstallment),
                                                                                    StudentController.updateInstallment)

// /api/v1/student/updateFinancialStudent/:id
router.put('/updateFinancialStudent/:id',Token.authAdmin('gm','fi'),validation(StudentValidation.updateFinancialStudent),
                                                                                    StudentController.updateFinancialStudent)

// /api/v1/student/attendee
router.put('/attendee',Token.authAdmin('gm','ad'),validation(StudentValidation.attendee),StudentController.attendeeStudent)

// /api/v1/student/updateProgramStudent/:id
router.put('/updateProgramStudent/:id',Token.authAdmin('gm','ad'),validation(StudentValidation.updateProgram),
                                                                            StudentController.updateProgramStudent)

// /api/v1/student/addModule:id
router.post('/addModule/:id',Token.authAdmin('gm','ad'),validation(StudentValidation.addModule),
                                                                            StudentController.addModuleStudent)

// /api/v1/student/updateModule:id?module=
router.put('/updateModule/:id',Token.authAdmin('gm','ad'),validation(StudentValidation.updateModules),
                                                                            StudentController.updateModuleStudent)

// /api/v1/student/deleteModule:id?module=
router.delete('/deleteModule/:id',Token.authAdmin('gm','ad'),StudentController.deleteModuleStudent)

// /api/v1/student/updateSpecialization:id?operation=
router.put('/updateSpecialization/:id',Token.authAdmin('gm','ad'),validation(StudentValidation.updateSpecialization),
                                                                                StudentController.updateSpecializationStudent)

// /api/v1/student/:id
router.get('/:id',Token.verifyToken, StudentController.getStudentById)





module.exports = router