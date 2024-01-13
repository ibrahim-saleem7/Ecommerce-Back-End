const _ = require('lodash');
const slugify = require('slugify');
const salesModel = require('../models/sales.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');





class SalesController{


/**
 *  @description Add New Brand
 *  @route /api/v1/brand
 *  @method POST
 *  @access private (only admin )  
 */

    static addSales = catchAsyncError(async function(req, res, next) {


            let body = _.pick(req.body , ['name','email', 'phone','isActive' ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
            // body = xssAttack(body)

            const salesExists = await salesModel.findOne({$or: [{email: body.email},{slug:slugify(body.name)} ,{phone: body.phone}]})

            if(salesExists) return next(new AppError('Sales already exists', 409))
            
            body.slug = await slugify(body.name)
            body.createdBy =req.user.name
            const newSales = await salesModel.create(body)
            return res.status(201).json({message:  `Seller : ${newSales.name} added successfully`});


    })


/**
 *  @description Get All Brands 
 *  @route /api/brand
 *  @method GET
 *  @access public
 */

    static  getAllSales = catchAsyncError(async function(req, res, next) {

        let {pageSize, pageNumber,sort  , keyword } = req.query
        let totalPages
        const search = {}
        
        // Pagination 
        // pageSize = Number(req.query.pageSize) ||  20
        // pageNumber = Number(req.query.pageNumber) || 1
        
        // Sorting
        sort = sort || '-createdAt'
        sort = sort?.replaceAll(',', ' ')
                
        // Search Keywords
        keyword = keyword || ''
        search.$or = [
            {name: {$regex: keyword, $options: 'i'}},
            {modules: {$regex: keyword, $options: 'i'}},
        ]

        const sales = await  salesModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .populate('sellerDealsCompanies.deal' , 'name  status comment isActive')
        .populate('sellerDealsStudent.deal' , 'fullName  registrationNumber status comment isActive')
        .sort(sort)
        .find(search)
        
        // if(specializations.length < pageSize ){
        //     totalPages  = specializations.length>pageSize? Math.ceil(specializations.length/pageSize) : 1
        // }else{
        //     totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
        // }

        return res.status(200).json(
            {
                // totalPages,
                requestResults: sales.length,
                // pageNumber,
                // pageSize,
                sales

            })
    

})






/**
 *  @description Get Brand By Id
 *  @route /api/brand/:id
 *  @method GET
 *  @access public   
 */
    static  getSalesById = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  sales = await salesModel.findById(req.params.id)
        .populate('sellerDealsCompanies.deal' , 'name  status comment isActive')
        .populate('sellerDealsStudent.deal' , 'fullName  registrationNumber status comment isActive')
        
        if(!sales) return next(new AppError('Sales not found', 404))

        return res.status(200).json(sales)



    })

/**
 *  @description Update Brand
 *  @route /api/brand/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateSales = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, ['name','email', 'phone', 'isActive'])
        
        if(!body) return next(new AppError('Data is Missing', 400))
        // body = xssAttack(body)

        if(body.name){
            body.slug = slugify(body.name)
        }
        body.updatedBy = req.user.name
        const  sales = await salesModel.findByIdAndUpdate(req.params.id, body ,{new: true})

        if(!sales) return next(new AppError('Sales not found', 404))

        

        return res.status(200).json({message : 'Sales updated successfully' , sales : sales.name})



    })

/**
 *  @description Delete Brand By Id
 *  @route /api/brand/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteSlotById = factory.deleteDocument(salesModel)
    
}




module.exports = SalesController