const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const SpecializationController = require('../controllers/specialization.controller')
const SpecializationValidation = require('../validations/specialization.validation')




router  // /api/v1/specialization
    .route("/")
    .get(Token.verifyToken,SpecializationController.getAllSpecialization)
    .post(Token.authAdmin(['gm','ad']),validation(SpecializationValidation.addSpecialization),
                                                        SpecializationController.addSpecialization)



router.put('/updateSpecializationModules/:id',Token.authAdmin(['gm','ad']),validation(SpecializationValidation.updateSpecializationModules),
                                                                                            SpecializationController.updateSpecializationModules)

router  // /api/v1/specialization/:id
   .route("/:id")
   .get(Token.verifyToken,SpecializationController.getSpecializationById)
   .delete(Token.authAdmin(['gm']),SpecializationController.deleteSpecializationById)
   .put(Token.authAdmin(['gm','ad']),validation(SpecializationValidation.updateSpecialization),
                                                        SpecializationController.updateSpecialization)




module.exports = router