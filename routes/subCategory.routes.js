const router = require('express').Router() 

const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const SubCategoryController = require('../controllers/subCategory.controller')
const SubCategoryValidation = require('../validations/subCategory.validation')




router  // /api/v1/supCategory
    .route("/")
    .get(SubCategoryController.getAllSubCategory)
    .post(validation(SubCategoryValidation.addSubCategory),SubCategoryController.addSubCategory)



router  // /api/v1/supCategory/:id
   .route("/:id")
   .get(SubCategoryController.getSubCategoryById)
   .delete(SubCategoryController.deleteSubCategoryById)
   .put(validation(SubCategoryValidation.updateSubCategory),SubCategoryController.updateSubCategory)




module.exports = router