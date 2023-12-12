const _ = require('lodash');
const slugify = require('slugify');
const categoryModel = require('../models/category.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');








class CategoryController{


/**
 *  @description Add New Category
 *  @route /api/v1/category
 *  @method POST
 *  @access private (only admin )  
 */

    static addCategory = catchAsyncError(async function(req, res, next) {


            const body = req.body
            const image = req.files?.image

            const categoryExists = await categoryModel.findOne({slug:slugify(body.name)})

            if(categoryExists) return next(new AppError('Category already exists', 409))
            if(!image) return next(new AppError("Image is Required", 400));

            body.image = await image[0]?.filename
            body.slug = await slugify(body.name)

            const newCategory = await categoryModel.create(body)
            return res.status(201).json({message:  'Category added successfully' , newCategory});


    })


/**
 *  @description Get All Categories 
 *  @route /api/category
 *  @method GET
 *  @access public
 */

    static  getAllCategories = catchAsyncError(async function(req, res, next) {

            // Pagination 
            // const pageSize = Number(req.query.pageSize) ||  20
            // const pageNumber = Number(req.query.pageNumber) || 1
            // let totalPages

            const categories = await categoryModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            

            // totalPages  = products.length>pageSize? (products.length/pageSize) : 1
        
            return res.status(200).json(
                {
                    // totalPages,
                    // pageNumber,
                    // pageSize,
                    requestResults: categories.length,
                    categories

                })
        

    })




/**
 *  @description Get Category By Id
 *  @route /api/category/:id
 *  @method GET
 *  @access public   
 */
    static  getCategoryById = factory.getDocumentById(categoryModel)
     

/**
 *  @description Update Category
 *  @route /api/category/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateCategory = factory.updateDocument(categoryModel)
    

/**
 *  @description Delete Category By Id
 *  @route /api/category/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteCategoryById = factory.deleteDocument(categoryModel)


}




module.exports = CategoryController