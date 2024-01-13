
const slugify = require('slugify');
const instructorModel = require('../models/instructor.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const _ = require('lodash');
const specializationModel = require('../models/specialization.model');
const addToTrash = require('../utils/addToTrash');
const fs = require('fs');
const path = require('path');
const xssAttack = require('../middlewares/xssAttack');






class InstructorController{


/**
 *  @description Add New Brand
 *  @route /api/v1/brand
 *  @method POST
 *  @access private (only admin )  
 */

    static addInstructor = catchAsyncError(async function(req, res, next) {


            let body = _.pick(req.body , [
                'fullName','firstName','lastName' ,
                'phoneNumber','personalEmail','businessEmail' ,
                'specializationList','contract',
                'status','comment','isActive' 
            ])

            const file = req.files?.contract

            if(!body) return next(new AppError('Data is Missing', 400))
            if (!file) return next(new AppError('contract is required',400))

            const instructorExists = await instructorModel.findOne({$or: [
                {phoneNumber: body.phoneNumber},
                {personalEmail: body.personalEmail},
                {slug: slugify(body.fullName)}
            ]}
            )

            if(instructorExists) return next(new AppError(`Instructor : ${body.fullName} already exists`, 409))
            
            
            body.slug = await slugify(body.fullName)
            body.contract = await file[0].filename
            body.createdBy =req.user.name

            const newInstructor = await instructorModel.create(body).then((result) => {
                result.specializationList?.forEach(async(ele) => {
                    let specialization = await specializationModel.findById(ele)
                    if(specialization){
                        specialization.instructorsList.push(result._id.toString())
                        await specialization.save()
                    }
                });

                return res.status(201).json({message:  `Instructor : ${result.fullName} added successfully`});
            })


    })


/**
 *  @description Get All Brands 
 *  @route /api/brand
 *  @method GET
 *  @access public
 */

    static  getAllInstructor = catchAsyncError(async function(req, res, next) {

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
            {fullName: {$regex: keyword, $options: 'i'}},
            {phoneNumber: {$regex: keyword, $options: 'i'}},
        ]

        const instructors = await  instructorModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .populate('specializationList' ,'name modules')
        .populate('intakeList' ,'name instructorsList')
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
                requestResults: instructors.length,
                // pageNumber,
                // pageSize,
                instructors

            })
    

})






/**
 *  @description Get Brand By Id
 *  @route /api/brand/:id
 *  @method GET
 *  @access public   
 */
    static  getInstructorById = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  instructor = await instructorModel.findById(req.params.id)
        .populate('specializationList' ,'name modules isActive')
        .populate('intakeList.intake' ,'name studentsList isActive')
        
        if(!instructor) return next(new AppError('Instructor not found', 404))

        return res.status(200).json(instructor)



    })

/**
 *  @description Update Brand
 *  @route /api/brand/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateInstructor = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, [
            'fullName','firstName','lastName' ,
            'phoneNumber','personalEmail','businessEmail' ,
            'status','comment','isActive' 
        ])
        const file = req.files?.contract

        if(!body) return next(new AppError('Data is Missing', 400))

        const  instructor = await instructorModel.findById(req.params.id)
        if(!instructor) return next(new AppError('Instructor not found', 404))


        if(body.fullName){
            body.slug = slugify(body.fullName)
        }
        body.updatedBy =req.user.name

        if(file){
            if(fs.existsSync(path.join(__dirname, `../uploads/${instructor?.contract}`))){
              fs.unlinkSync(path.join(__dirname, `../uploads/${instructor?.contract}`))
            }
            body.contract = await file[0].filename
        }
        
        body = xssAttack(body)

        const  instructorUpdate = await instructorModel.findByIdAndUpdate(req.params.id, body ,{new: true})
            
        return res.status(200).json({message : `Instructor : ${instructorUpdate.fullName} updated successfully`})



        
    })







/**
     *  @description Update Brand
     *  @route /api/brand/:id?moduleId=
     *  @method PUT
     *  @access private (only admin )  
     */
static  updateSpecializationInstructor = catchAsyncError(async function(req, res, next) {
    

    const instructorId = req.params.id 
    const operation = req.query.operation

    if(!instructorId) return next(new AppError('instructor id is Missing', 400))
    if(!operation) return next(new AppError('operation is required', 400))
    
    let body = _.pick(req.body, 
        [
            'specialization'
        ])
    
    if(!body) return next(new AppError('Data is Missing', 400))

    let  instructor = await instructorModel.findById(instructorId)
    if(!instructor) return next(new AppError('instructor not found', 404))

    let specialization = await specializationModel.findById(body.specialization)
    if(!specialization) return next(new AppError(`specialization not found`, 404))
    
    if(operation == 'add'){
        if(instructor.specializationList.includes(body.specialization)){
            return next(new AppError(`specialization : ${specialization.name} already assigned to instructor : ${instructor.fullName}`, 409))
        }
        
        specialization.instructorsList.push(instructor._id.toString())
        await specialization.save()
        
        instructor.specializationList.push(body.specialization)
        instructor.updatedBy = req.user.name // uerName
        await instructor.save()
    
        return res.status(201).json(
            {
                message : `specialization : ${specialization.name} added to instructor : ${instructor.fullName} successfully` , 
            })


    }else if(operation == 'remove'){

        let indexSpecialization = instructor.specializationList.indexOf(body.specialization)
        if(indexSpecialization == -1){
            return next(new AppError(`specialization : ${specialization.name} not assigned to instructor : ${instructor.fullName}`, 409))
        }

        instructor.specializationList.splice(indexSpecialization, 1)
        await instructor.save()

        specialization.instructorsList.splice(specialization.instructorsList.indexOf(instructorId))
        await specialization.save()
        
        let trash = {
            deletedItem : specialization.name + ' of ' + instructor.fullName,
            deletedBy : req.user.name , // userName
        }

        await addToTrash(trash)

        return res.status(201).json(
            {
                message : `specialization : ${specialization.name} deleted from instructor : ${instructor.fullName} successfully` , 
            })


    }


    



})






/**
 *  @description Delete Brand By Id
 *  @route /api/brand/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteInstructorById = factory.deleteDocument(instructorModel)
    
}





module.exports =InstructorController
            
