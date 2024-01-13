const _ = require('lodash');
const slugify = require('slugify');
const programModel = require('../models/program.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');








class ProgramController{


/**
 *  @description Add New Category
 *  @route /api/v1/category
 *  @method POST
 *  @access private (only admin )  
 */

    static addProgram = catchAsyncError(async function(req, res, next) {


            let body = _.pick(req.body,['name','specialization','programAbbreviation', 'isActive' ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
             

            const programExists = await programModel.findOne({slug:slugify(body.name), specialization : body.specialization})

            if(programExists) return next(new AppError('program already exists', 409))

            body.slug = await slugify(body.name)
            body.createdBy = req.user.name
            const newProgram = await programModel.create(body)
            return res.status(201).json({message:  'Program added successfully' , program : newProgram.name});


    })


/**
 *  @description Get All Categories 
 *  @route /api/category
 *  @method GET
 *  @access public
 */

    static  getAllPrograms = catchAsyncError(async function(req, res, next) {

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
            {programAbbreviation: {$regex: keyword, $options: 'i'}},
            // {specialization: {$regex: keyword, $options: 'i'}},
        ]


        
        const programs = await  programModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .sort(sort)
        .populate('specialization' , 'name modules')
        .populate('intakeList' , 'name ')
        .find(search)
        
        
        // if(specializations.length < pageSize ){
        //     totalPages  = specializations.length>pageSize? Math.ceil(specializations.length/pageSize) : 1
        // }else{
        //     totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
        // }

        return res.status(200).json(
            {
                // totalPages,
                requestResults: programs.length,
                // pageNumber,
                // pageSize,
                programs

            })
    

    })




/**
 *  @description Get Category By Id
 *  @route /api/category/:id
 *  @method GET
 *  @access public   
 */
    static  getProgramById = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  program = await programModel.findById(req.params.id)
        .populate('specialization' , 'name modules')
        .populate('studentList' ,'fullName registrationNumber status comment isActive')
        .populate('intakeList' )
        
        if(!program) return next(new AppError('program not found', 404))

        return res.status(200).json(program)



    })

/**
 *  @description Update Category
 *  @route /api/category/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateProgram = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, ['name','specialization','programAbbreviation', 'isActive'])
        
        if(!body) return next(new AppError('Data is Missing', 400))
         

        if(body.name){
            body.slug = slugify(body.name)
        }
        body.updatedBy = req.user.name
        const  program = await programModel.findByIdAndUpdate(req.params.id, body ,{new: true})

        if(!program) return next(new AppError('program not found', 404))

        
        return res.status(200).json({message : 'Program updated successfully' , program : program.name})

    })

/**
 *  @description Delete Category By Id
 *  @route /api/category/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteProgramById = factory.deleteDocument(programModel)


}




module.exports = ProgramController