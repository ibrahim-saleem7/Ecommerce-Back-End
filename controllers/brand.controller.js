const _ = require('lodash');
const slugify = require('slugify');
const brandModel = require('../models/brand.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');





class BrandController{


/**
 *  @description Add New Brand
 *  @route /api/v1/brand
 *  @method POST
 *  @access private (only admin )  
 */

    static addBrand = catchAsyncError(async function(req, res, next) {


            const body = req.body 
            const image = req.files?.image
            
            const brandExists = await brandModel.findOne({slug:slugify(body.name)})

            if(brandExists) return next(new AppError('Brand already exists', 409))
            if(!image) return next(new AppError("Image is Required", 400));
            
            body.image = await image[0].filename
            body.slug = await slugify(body.name)

            const newBrand = await brandModel.create(body)
            return res.status(201).json({message:  'Brand added successfully' , newBrand});


    })


/**
 *  @description Get All Brands 
 *  @route /api/brand
 *  @method GET
 *  @access public
 */

    static  getAllBrands = catchAsyncError(async function(req, res, next) {

            // Pagination 
            // const pageSize = Number(req.query.pageSize) ||  20
            // const pageNumber = Number(req.query.pageNumber) || 1
            // let totalPages

            const brands = await brandModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)

            // totalPages  = brands.length>pageSize? (brands.length/pageSize) : 1

            return res.status(200).json(
                {
                    // totalPages,
                    // pageNumber,
                    // pageSize,
                    requestResults: brands.length,
                    brands

                })
        

    })




/**
 *  @description Get Brand By Id
 *  @route /api/brand/:id
 *  @method GET
 *  @access public   
 */
    static  getBrandById = factory.getDocumentById(brandModel)
    
/**
 *  @description Update Brand
 *  @route /api/brand/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateBrand = factory.updateDocument(brandModel)

/**
 *  @description Delete Brand By Id
 *  @route /api/brand/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteBrandById = factory.deleteDocument(brandModel)
    
}




module.exports = BrandController