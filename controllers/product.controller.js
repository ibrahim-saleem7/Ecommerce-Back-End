const _ = require('lodash');
const productModel = require('../models/product.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const slugify = require('slugify');
const categoryModel = require('../models/category.model');
const brandModel = require('../models/brand.model');
const subCategoryModel = require('../models/subCategory.model');
const factory = require('../utils/handlersFactory');





class ProductController{


/**
 *  @description Add New Product
 *  @route /api/v1/product
 *  @method POST
 *  @access private (only admin )  
 */

    static addProduct = catchAsyncError(async function(req, res, next){

            let body = req.body 
            const images = req.files?.images
            const imageCover = req.files?.imageCover
            let imagesArr = []

            if(!body) return next(new AppError('Missing required data'));

            const categoryExists = await categoryModel.findById(body.category)
            if(!categoryExists) return next(new AppError('Category not found', 404))

            const subCategoryExists = await subCategoryModel.findOne({_id: body.subCategory , category: body.category})
            if(!subCategoryExists) return next(new AppError('SubCategory not found', 404))

            const brandExists = await brandModel.findById(body.brand)
            if(!brandExists) return next(new AppError('Brand not found', 404))

            const product = await productModel.findOne(
                {
                    slug : slugify(body.title) ,
                    category : body.category,
                    subCategory : body.subcategory,
                    brand : body.brand,
                })

            if(product) return next(new AppError('Product is already added' , 409))
            
            if(body.priceAfterDiscount >= body.price) return next(new AppError('Price After Discount must be less than Price'))

            await images.forEach(element => {
                imagesArr.push(element.filename)                
            });
            
            body.slug = await slugify(body.title)
            body.imageCover = await imageCover[0].filename
            body.images = imagesArr

            const newProduct = await productModel.create(body)
            return res.status(201).json({message:  'Product added successfully' , product: newProduct})
        
        

    })


/**
 *  @description Get All Products
 *  @route /api/v1/product
 *  @method GET
 *  @access public  
 */

    static getAllProducts = catchAsyncError(async function(req, res, next){

            
            let {pageSize, pageNumber,sort ,fields , keyword ,...other} = req.query
            let totalPages
            const search = {}
            
            // Pagination 
            pageSize = Number(req.query.pageSize) ||  20
            pageNumber = Number(req.query.pageNumber) || 1
            
            // Sorting
            sort = sort || '-createdAt'
            sort = sort?.replaceAll(',', ' ')
        
            // Fields
            fields = fields || '-__v'
            fields = fields?.replaceAll(',', ' ')
            
            // Search Keywords
            keyword = keyword || ''
            search.$or = [
                {title: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}},
            ]

            const countDocuments = await productModel.countDocuments()

            const products = await  productModel.find(other)
            .skip((pageNumber -1 ) * pageSize)
            .limit(pageSize)
            .populate('category subCategory brand' , 'name')
            .select(fields)
            .sort(sort)
            .find(search)
            
            if(products.length < pageSize ){
                totalPages  = products.length>pageSize? Math.ceil(products.length/pageSize) : 1
            }else{
                totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
            }

            return res.status(200).json(
                {
                    totalPages,
                    requestResults: products.length,
                    pageNumber,
                    pageSize,
                    products
                })
        
        

    })


/**
 *  @description Get Product By Id
 *  @route /api/v1/product/:id
 *  @method GET
 *  @access public  
 */
    static getProductById = factory.getDocumentById(productModel)
     

/**
 *  @description Update Product By Id
 *  @route /api/v1/product/:id
 *  @method UPDATE
 *  @access private (Admin)   
 */
     static updateProduct = factory.updateDocument(productModel,'product')
   

/**
 *  @description Delete Product By Id
 *  @route /api/v1/product/:id
 *  @method DELETE
 *  @access private (Admin)   
 */
    static deleteProduct = factory.deleteDocument(productModel)

}





module.exports = ProductController