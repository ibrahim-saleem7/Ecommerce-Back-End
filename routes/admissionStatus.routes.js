const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const SlotController = require('../controllers/slot.controller')
const AdmissionStatusValidation = require('../validations/AdmissionStatus.validation')
const AdmissionStatusController = require('../controllers/admissionStatus.controller')






router  // /api/v1/admissionStatus
    .route("/")
    .get(Token.verifyToken,AdmissionStatusController.getAllStatus)
    .post(Token.authAdmin(['gm','ad']),validation(AdmissionStatusValidation.addAdmissionStatus),AdmissionStatusController.addStatus) 



// router  // /api/v1/slot/:id
//    .route("/:id")
//    .get(Token.verifyToken,AdmissionStatusController.getSlotById)
//    .delete(Token.authAdmin(['gm']),AdmissionStatusController.deleteSlotById)
//    .put(Token.authAdmin(['gm','ad']),validation(SlotValidation.updateSlot),AdmissionStatusController.updateSlot)




module.exports = router