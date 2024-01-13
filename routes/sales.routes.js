const router = require("express").Router();
const validation = require("../middlewares/validation");
const SalesController = require("../controllers/sales.controller");
const SalesValidation = require("../validations/sales.validation");
const fileUpload = require('../utils/fileUpload')
const Token = require("../middlewares/verifyToken");



router  // /api/v1/sales
    .route("/")
    .get(Token.verifyToken,SalesController.getAllSales)
    .post(Token.authAdmin(['gm' ,'ad']),validation(SalesValidation.addSales),SalesController.addSales)



router  // /api/v1/sales/:id
   .route("/:id")
   .get(Token.verifyToken,SalesController.getSalesById)
   .delete(Token.authAdmin(['gm']),SalesController.deleteSlotById)
   .put(Token.authAdmin(['gm' ,'ad']),validation(SalesValidation.updateSales),SalesController.updateSales)



module.exports = router;
