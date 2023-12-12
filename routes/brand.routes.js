const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const BrandController = require('../controllers/brand.controller')
const BrandValidation = require('../validations/brand.validation')
const fileUpload = require('../utils/fileUpload')





router  // /api/v1/brand
    .route("/")
    .get(BrandController.getAllBrands)
    .post(fileUpload('image'),validation(BrandValidation.addBrand),BrandController.addBrand) 



router  // /api/v1/brand/:id
   .route("/:id")
   .get(BrandController.getBrandById)
   .delete(BrandController.deleteBrandById)
   .put(fileUpload('image'),validation(BrandValidation.updateBrand),BrandController.updateBrand)




module.exports = router