const _ = require('lodash');
const slugify = require('slugify');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const specializationModel = require('../models/specialization.model');
const addToTrash = require('../utils/addToTrash');








class SpecializationController{


/**
 *  @description Add New Specialization
 *  @route /api/v1/specialization
 *  @method POST
 *  @access private (only admin )  
 */

    static addSpecialization = catchAsyncError(async function(req, res, next) {


            let body = _.pick(req.body , ['name','modules', 'isActive' ])

            const specializationExists = await specializationModel.findOne({slug:slugify(body.name)})

            if(specializationExists) return next(new AppError('Specialization already exists', 409))

            body.slug = slugify(body.name)
            body.createdBy = req.user.name
            const newSpecialization = await specializationModel.create(body)

            return res.status(201).json({message:  `Specialization : ${ newSpecialization.name} added successfully`});


    })


/**
 *  @description Get All Specialization 
 *  @route /api/specialization
 *  @method GET
 *  @access public
 */

    static  getAllSpecialization = catchAsyncError(async function(req, res, next) {

            let {pageSize, pageNumber,sort  , keyword } = req.query
            let totalPages
            const search = {}
            
            // Pagination 
            pageSize = Number(req.query.pageSize) ||  20
            pageNumber = Number(req.query.pageNumber) || 1
            
            // Sorting
            sort = sort || '-createdAt'
            sort = sort?.replaceAll(',', ' ')
                    
            // Search Keywords
            keyword = keyword || ''
            search.$or = [
                {name: {$regex: keyword, $options: 'i'}},
                {modules: {$regex: keyword, $options: 'i'}},
            ]

            const specializations = await  specializationModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            .sort(sort)
            .find(search)
            .populate('instructorsList studentsList' ,'fullName status isActive')

            // if(specializations.length < pageSize ){
            //     totalPages  = specializations.length>pageSize? Math.ceil(specializations.length/pageSize) : 1
            // }else{
            //     totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
            // }

            return res.status(200).json(
                {
                    // totalPages,
                    requestResults: specializations.length,
                    // pageNumber,
                    // pageSize,
                    specializations

                })
        

    })




/**
 *  @description Get Specialization By Id
 *  @route /api/specialization/:id
 *  @method GET
 *  @access public   
 */
    static  getSpecializationById = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  specialization = await specializationModel.findById(req.params.id)
        .populate('instructorsList studentsList' ,'fullName status isActive')

        if(!specialization) return next(new AppError('Specialization not found', 404))

        return res.status(200).json(specialization)



    })



/**
 *  @description Update Specialization
 *  @route /api/specialization/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateSpecialization = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, ['name', 'isActive', ])
        
        if(!body) return next(new AppError('Data is Missing', 400))

        if(body.name){
            body.slug = slugify(body.name)
        }

        body.updatedBy=req.user.name
        const  specialization = await specializationModel.findByIdAndUpdate(req.params.id, body ,{new: true})

        if(!specialization) return next(new AppError('Specialization not found', 404))

        

        return res.status(200).json({message : 'specialization updated successfully' , specialization : specialization.name})



    })


/**
 *  @description Update Specialization
 *  @route /api/specialization/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateSpecializationModules = catchAsyncError(async function(req, res, next) {



        const operation = req.query.operation
        const module = req.query.module
        const specializationId = req.params.id;

        const body = _.pick(req.body, 
            [
              'module'
            ])

        if(!specializationId) return next(new AppError('id is Missing', 404))
        if(!body) return next(new AppError('Data is Missing', 400))

        let  specialization = await specializationModel.findById(specializationId)
        
        if(!specialization) return next(new AppError('Specialization not found', 404))
        
        
        if(operation === 'add'){
            
            let checkModule =specialization.modules.includes(body.module)
            if(checkModule) return next(new AppError(`Module ${body.module} already exists`,409))

            specialization.modules.push(body.module)
            await specialization.save()
            body.updatedBy=req.user.name

            return res.status(200).json({message : `module : ${body.module} add to specialization : ${specialization.name} successfully`, })


        }else if(operation === 'remove'){

            let checkModule =specialization.modules.indexOf(body.module)
            if(checkModule == -1) return next(new AppError(`Module ${body.module} not found in ${specialization.name}`,404))

            specialization.modules.splice(checkModule, 1)
            await specialization.save()

            body.updatedBy=req.user.name

            let trash ={
                deletedItem : body.module + ' of ' + specialization.name,
                deletedBy : req.user.name , // userName
            }
            await addToTrash(trash)

            return res.status(200).json({message : `module : ${body.module} delete from specialization : ${specialization.name} successfully`, })

        }else if(operation === 'update'){

            if(!module) return next(new AppError('module is Missing', 400))
            let checkModule =specialization.modules.indexOf(module)
            if(checkModule == -1) return next(new AppError(`Module ${module} not found in ${specialization.name}`,404))


            specialization.modules[checkModule] = body.module
            await specialization.save()
            body.updatedBy=req.user.name

            return res.status(200).json({message : `module : ${body.module} update in specialization : ${specialization.name} successfully`, })


        }else{
            return next(new AppError('operation invalid', 400))
        }




        



    })


/**
 *  @description Delete Specialization By Id
 *  @route /api/specialization/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteSpecializationById = factory.deleteDocument(specializationModel)
    
}



module.exports = SpecializationController