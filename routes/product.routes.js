const router = require("express").Router();
const validation = require("../middlewares/validation");
const AuthController = require("../controllers/auth");
const ProductController = require("../controllers/product.controller");
const ProductValidation = require("../validations/product.validation");
const fileUpload = require('../utils/fileUpload')



router  // /api/v1/product
    .route("/")
    .get(ProductController.getAllProducts)
    .post(fileUpload('images','imageCover'),validation(ProductValidation.addProduct),ProductController.addProduct)



router  // /api/v1/product/:id
   .route("/:id")
   .get(ProductController.getProductById)
   .delete(ProductController.deleteProduct)
   .put(fileUpload('images','imageCover'),validation(ProductValidation.updateProduct),ProductController.updateProduct)






module.exports = router;
