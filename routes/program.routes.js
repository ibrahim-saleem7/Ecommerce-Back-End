const router = require('express').Router() 
const fileUpload = require('../utils/fileUpload')
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const ProgramController = require('../controllers/program.controller')
const ProgramValidation = require('../validations/program.validation')



router  // /api/v1/program
    .route("/")
    .get(Token.verifyToken,ProgramController.getAllPrograms)
    .post(Token.authAdmin(['gm' ,'ad']),validation(ProgramValidation.addProgram),ProgramController.addProgram)



router  // /api/v1/program/:id
   .route("/:id")
   .get(Token.verifyToken,ProgramController.getProgramById)
   .put(Token.authAdmin(['gm' ,'ad']),validation(ProgramValidation.updateProgram),ProgramController.updateProgram)
   .delete(Token.authAdmin(['gm']),ProgramController.deleteProgramById)




module.exports = router