const router = require('express').Router() 
const fileUpload = require('../utils/fileUpload')
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const CategoryController = require('../controllers/category.controller')
const CategoryValidation = require('../validations/category.validation')



router  // /api/v1/category
    .route("/")
    .post(fileUpload('image'),validation(CategoryValidation.addCategory),CategoryController.addCategory)
    .get(CategoryController.getAllCategories)



router  // /api/v1/category/:id
   .route("/:id")
   .get(CategoryController.getCategoryById)
   .put(fileUpload('image'),validation(CategoryValidation.updateCategory),CategoryController.updateCategory)
   .delete(CategoryController.deleteCategoryById)




module.exports = router