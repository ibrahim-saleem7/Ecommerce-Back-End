const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const OrderController = require('../controllers/order.controller')
const OrderValidation = require('../validations/order.validation')




router  // /api/v1/order
    .route("/")
    .post(validation(OrderValidation.addOrder),OrderController.addOrder) 
    router.get("/",OrderController.getAllOrders)
    
    // /api/v1/order/action/:id
    router.put("/action/:id",validation(OrderValidation.actionOrder), OrderController.actionOrder)
    router.put("/cancel/:id", OrderController.cancelOrder)
// router  // /api/v1/order/confirmation/:id
//    .route("/confirmation/:id")
//    .put(OrderController.confirmationOrder)
//    .delete(OrderController.deleteBrandById)
//    .put(fileUpload('image'),validation(BrandValidation.updateBrand),OrderController.updateBrand)




module.exports = router