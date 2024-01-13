const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const SlotController = require('../controllers/slot.controller')
const SlotValidation = require('../validations/slot.validation')





router  // /api/v1/slot
    .route("/")
    .get(Token.verifyToken,SlotController.getAllSlots)
    .post(Token.authAdmin(['gm','ad']),validation(SlotValidation.addSlot),SlotController.addSlot) 



router  // /api/v1/slot/:id
   .route("/:id")
   .get(Token.verifyToken,SlotController.getSlotById)
   .delete(Token.authAdmin(['gm']),SlotController.deleteSlotById)
   .put(Token.authAdmin(['gm','ad']),validation(SlotValidation.updateSlot),SlotController.updateSlot)




module.exports = router