const _ = require('lodash');
const slugify = require('slugify');
const slotModel = require('../models/slot.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const xssAttack = require('../middlewares/xssAttack');






class SlotController{


/**
 *  @description Add New Brand
 *  @route /api/v1/brand
 *  @method POST
 *  @access private (only admin )  
 */

    static addSlot = catchAsyncError(async function(req, res, next) {


            let body = _.pick(req.body , ['name','days', 'isActive' ])
            if(!body) return next(new AppError('Data is Missing', 400))
            
            const slotExists = await slotModel.findOne({slug:slugify(body.name)})

            if(slotExists) return next(new AppError('slot already exists', 409))
            
            body.slug = await slugify(body.name)
            body.createdBy = req.user.name
            const newSlot = await slotModel.create(body)
            return res.status(201).json({message:  'slot added successfully' , slot :newSlot.name});


    })


/**
 *  @description Get All Brands 
 *  @route /api/brand
 *  @method GET
 *  @access public
 */

    static  getAllSlots = catchAsyncError(async function(req, res, next) {

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

        const slots = await  slotModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
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
                requestResults: slots.length,
                // pageNumber,
                // pageSize,
                slots

            })
    

})






/**
 *  @description Get Brand By Id
 *  @route /api/brand/:id
 *  @method GET
 *  @access public   
 */
    static  getSlotById = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  slot = await slotModel.findById(req.params.id)

        if(!slot) return next(new AppError('slot not found', 404))

        return res.status(200).json(slot)



    })

/**
 *  @description Update Brand
 *  @route /api/brand/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateSlot = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, ['name','days', 'isActive'])
        
        if(!body) return next(new AppError('Data is Missing', 400))

        if(body.name){
            body.slug = slugify(body.name)
        }
        body.updatedBy = req.user.name
        const  slot = await slotModel.findByIdAndUpdate(req.params.id, body ,{new: true})

        if(!slot) return next(new AppError('slot not found', 404))

        

        return res.status(200).json({message : 'slot updated successfully' , slot : slot.name})



    })

/**
 *  @description Delete Brand By Id
 *  @route /api/brand/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteSlotById = factory.deleteDocument(slotModel)
    
}




module.exports = SlotController