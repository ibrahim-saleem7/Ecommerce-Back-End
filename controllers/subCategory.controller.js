const _ = require('lodash');
const slugify = require('slugify');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const subCategoryModel = require('../models/subCategory.model');










class SubCategoryController{


/**
 *  @description Add New SupCategory
 *  @route /api/v1/supCategory
 *  @method POST
 *  @access private (only admin )  
 */

    static addSubCategory = catchAsyncError(async function(req, res, next) {


        const body = _.pick(req.body ,['name' , 'category']) 

            const supCategoryExists = await subCategoryModel.findOne(
                {
                    slug:slugify(body.name),
                    category:body.category
                })

            if(supCategoryExists) return next(new AppError('SupCategory already exists', 409))

            
            const newSupCategory = await subCategoryModel.create(
                {
                    name :body.name ,
                    slug:slugify(body.name),
                    category:body.category
                })

            return res.status(201).json({message:  'SupCategory added successfully' , newSupCategory});


    })


/**
 *  @description Get All SupCategory 
 *  @route /api/supCategory
 *  @method GET
 *  @access public
 */

    static  getAllSubCategory = catchAsyncError(async function(req, res, next) {

            const categoryId = req.query.categoryId
            const filtration =  categoryId ? { category: categoryId } : {};

            const SupCategories = await subCategoryModel.find(filtration)

            return res.status(200).json(
                {
                    requestResults: SupCategories.length,
                    SupCategories

                })
        

    })




/**
 *  @description Get SupCategory By Id
 *  @route /api/supCategory/:id
 *  @method GET
 *  @access public   
 */
    static  getSubCategoryById = factory.getDocumentById(subCategoryModel)


/**
 *  @description Update SupCategory
 *  @route /api/supCategory/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateSubCategory = factory.updateDocument(subCategoryModel)


/**
 *  @description Delete SupCategory By Id
 *  @route /api/supCategory/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteSubCategoryById = factory.deleteDocument(subCategoryModel)
    
}



module.exports = SubCategoryController