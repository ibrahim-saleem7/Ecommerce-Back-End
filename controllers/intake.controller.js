const _ = require('lodash');
const slugify = require('slugify');
const intakeModel = require('../models/intake.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const slotModel = require('../models/slot.model');
const studentModel = require('../models/student.model');
const programModel = require('../models/program.model');
const instructorModel = require('../models/instructor.model');

const addToTrash = require('../utils/addToTrash');
const { rejections } = require('winston');









class IntakeController{


/**
     *  @description Add New Brand
     *  @route /api/v1/intake
     *  @method POST
     *  @access private (only admin )  
     */
    
        static addIntake = catchAsyncError(async function(req, res, next) {
    
    
                let body = _.pick(req.body ,
                        [
                            'name','slot','programList' ,
                            'studentsList','instructorsList','status',
                            'comment' ,'isActive' ,
                        ])
                
                if(!body) return next(new AppError('Data is Missing', 400))
                // body = xssAttack(body)
                // console.log(body)

                const intakeExists = await intakeModel.findOne({slug:slugify(body.name)})
                if(intakeExists) return next(new AppError('intake already exists', 409))
                
                body.slug = await slugify(body.name)
                body.createdBy = req.user.name


                let allIntakes = await intakeModel.find({})
                .select('studentsList name')
                var studentProfile
                var studentExistsIntake 
                var intakeName
                var isExists = false

                intakesLoop: for(var i = 0; i < allIntakes.length; i++){
                        intakeName =allIntakes[i].name
                        studentsLoop: for(var x = 0; x < body.studentsList.length; x++){
                            studentExistsIntake = allIntakes[i].studentsList.includes(body.studentsList[x])
                            if(studentExistsIntake){
                                studentProfile =  await studentModel.findById(body.studentsList[x])
                                .select('fullName')
                                isExists = true

                                break intakesLoop
                            }
                        }
                    }


                // console.log(isExists)
                if(isExists) return next(new AppError(`Student : ${studentProfile?.fullName} already exists in intake : ${intakeName}`, 409))

                if(!isExists){
                    
                       const newIntake = await intakeModel.create(body)

                       let obj = {intake : newIntake?._id}

                       await body.studentsList.forEach(async(ele)=>{
                           let studentProfile = await studentModel.findById(ele.student)
                           if(studentProfile != null ){
                               studentProfile.intakeList?.push(obj)
                               await studentProfile.save()                   
       
                           }
                               
                       })
       
                       await body.instructorsList.forEach(async(ele)=>{
                           let instructorProfile = await instructorModel.findById(ele.moduleInstructor)
                           if(instructorProfile != null ){
                               instructorProfile.intakeList?.push(obj)
                               await instructorProfile.save()                   
       
                           }
                    
                       })
       
                       await body.programList.forEach(async(ele)=>{
                           let program = await programModel.findById(ele.program)
                           if(program != null ){
                               let existsIntake =  program.intakeList?.includes(newIntake._id)
                               if(!existsIntake){
                                   program.intakeList?.push(newIntake._id)
                                   await program.save()                   
                               }
                           }
                                         
                       })
       
                       return res.status(201).json({message:  `intake ${newIntake.name} added successfully`});

                }
    
                
    
    
        })

    
    /**
     *  @description Get All Brands 
     *  @route /api/brand
     *  @method GET
     *  @access public
     */
    
        static  getAllIntakes = catchAsyncError(async function(req, res, next) {
    
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
    
            const intakes = await  intakeModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            .populate('programList.program','programAbbreviation')
            .populate('slot','name days')
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
                    requestResults: intakes.length,
                    // pageNumber,
                    // pageSize,
                    intakes
    
                })
        
    
    })
    
    
    
    
    
    
    /**
     *  @description Get Brand By Id
     *  @route /api/brand/:id
     *  @method GET
     *  @access public   
     */
        static  getIntakeById = catchAsyncError(async function(req, res, next) {
    
    
            if(!req.params.id) return next(new AppError('id is Missing', 404))
    
            const  intake = await intakeModel.findById(req.params.id)
            .populate('studentsList', 'fullName registrationNumber programEnrolled studentModules comment isActive')
            .populate('slot','name days')
            .populate('instructorsList.moduleCorrector instructorsList.moduleInstructor' ,'fullName comment')


            if(!intake) return next(new AppError('Intake not found', 404))
    
            return res.status(200).json(intake)
    
    
    
        })


/**
     *  @description Add New Brand
     *  @route /api/v1/intake/studentAssign/:id
     *  @method POST
     *  @access private (only admin )  
     */
    
        static studentAssignToIntake = catchAsyncError(async function(req, res, next) {
    
                const intakeId = req.params.id
                let body = _.pick(req.body ,
                        [
                            'studentId' ,'comment' ,
                        ])
                
                if(!body) return next(new AppError('Data is Missing', 400))

                let intake = await intakeModel.findById(intakeId)
                if(!intake) return next(new AppError('intake is not found', 404))

                let studentProfile = await studentModel.findById(body.studentId)
                if(!studentProfile) return next(new AppError('Student is not found', 404))
                
                const studentExists = intake?.studentsList?.includes(body.studentId)
                if(studentExists) return next(new AppError(`Student : ${studentProfile.fullName }is already assigned to intake : ${intake.name}`, 409))
                
                const checkStudentAnyInTake = await intakeModel.find({
                    "studentsList":{
                        $eq:body.studentId
                    }
                })

                if(checkStudentAnyInTake.length > 0) return next(new AppError(`Student : ${studentProfile.fullName }is already assigned to intake : ${checkStudentAnyInTake[0].name}`, 409))

                
                
                let obj = {
                    intake : intake._id,
                    comment : body.comment,
                    assignBy : req.user.name,
                    assignAt : new Date(),
                }
                
                studentProfile.intakeList?.push(obj)
                intake.studentsList.push(body.studentId)
                await studentProfile.save()
                await intake.save()
                
                return res.status(201).json({message:  `student : ${studentProfile.fullName} added successfully to intake : ${intake.name}`});
                   
    
        })
    



/**
    *  @description Add New Brand
    *  @route /api/v1/intake/transferStudent/:id?studentId=
    *  @method POST
    *  @access private (only admin )  
*/
    
        static transferStudentIntake = catchAsyncError(async function(req, res, next) {
    
    
            const intakeId = req.params.id
            // const studentId = req.query.studentId
            const body = _.pick(req.body ,
                    [
                        'intakeId' ,'comment','studentId' 
                    ])
            
            if(!body) return next(new AppError('Data is Missing', 400))

            let intake = await intakeModel.findById(intakeId)
            if(!intake) return next(new AppError('intake is not found', 404))

            let studentProfile = await studentModel.findById(body.studentId)
            if(!studentProfile) return next(new AppError('Student is Not found', 404))

            let newIntake = await intakeModel.findById(body.intakeId)
            if(!newIntake) return next(new AppError('the intake transferred to is not found', 404))

            if(intakeId == body.intakeId) return next(new AppError(`Sorry , you can't  transfer student : ${studentProfile.fullName} to same intake`, 409))

            const studentExists = intake?.studentsList?.indexOf(body.studentId)
            if(studentExists == -1 ) return next(new AppError(`Student : ${studentProfile.fullName} is Not found in intake : ${intake.name}`, 404))

            let obj = {
                intake : intakeId,
                comment : body.comment,
                updateBy : req.user.name,
                updateAt : new Date(),
            }
            
            studentProfile?.intakeList?.push(obj)
            await studentProfile.save()

            intake?.studentsList?.splice(studentExists,1)
            await intake.save()

            newIntake?.studentsList?.push(body.studentId)
            await newIntake.save()
            
            return res.status(201).json({message:  `student : ${studentProfile.fullName} transfer successfully from intake : ${intake.name} to intake : ${newIntake.name}`});
               
    
        })



/**
    *  @description Add New Brand
    *  @route /api/v1/intake/removeStudent/:id?studentId=
    *  @method POST
    *  @access private (only admin )  
*/
    
        static removeStudentIntake = catchAsyncError(async function(req, res, next) {
    
    
            const intakeId = req.params.id
            // const studentId = req.query.studentId
            let body = _.pick(req.body ,
                    [
                        'comment', 'studentId'
                    ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
            // body = xssAttack(body)

            let intake = await intakeModel.findById(intakeId)
            if(!intake) return next(new AppError('intake is not found', 404))

            let studentProfile = await studentModel.findById(body.studentId)
            if(!studentProfile) return next(new AppError('Student is Not found', 404))
            
            const studentExists = intake?.studentsList?.indexOf(body.studentId)
            if(studentExists == -1 ) return next(new AppError(`Student : ${studentProfile.fullName} is Not found in intake : ${intake.name}`, 404))
            
            

            studentProfile?.intakeList.forEach(async (ele)=>{
                if(ele.intake == intakeId){
                    ele.comment = await body.comment
                    ele.updateBy = req.user.name
                    ele.updateAt = new Date()
                    return ;
                }
            })

            intake?.studentsList?.splice(studentExists,1)
            await intake.save()
            await studentProfile.save()
              
            let trash = {
                deletedBy: req.user.name, // userName
                deletedItem :studentProfile.fullName  + ' of ' +  intake.name ,
            }

            await addToTrash(trash)
            return res.status(201).json({message:  `student : ${studentProfile.fullName} remove successfully from intake:  ${intake.name} `});
               
    
        })



/**
     *  @description Add New Brand
     *  @route /api/v1/intake/instructorAssign/:id
     *  @method POST
     *  @access private (only admin )  
     */
    
static instructorAssignToIntake = catchAsyncError(async function(req, res, next) {
    
    const intakeId = req.params.id
    let body = _.pick(req.body ,
            [
                'moduleInstructor' ,'moduleName' ,
                'moduleCorrector',,
            ])
    
    if(!body) return next(new AppError('Data is Missing', 400))
    // body = xssAttack(body)

    let intake = await intakeModel.findById(intakeId)
    if(!intake) return next(new AppError('intake is not found', 404))

    let instructorProfile = await instructorModel.findById(body.moduleInstructor)
    if(!instructorProfile) return next(new AppError('module instructor  is not found',404))

      let instructorExists 
      intake?.instructorsList?.forEach((ele)=>{
        if(ele.moduleInstructor == body.moduleInstructor){
            return instructorExists = true
        }
    })

    if(instructorExists) return next(new AppError('module instructor is already assigned to intake', 409))
    
    if(body.moduleInstructor != body.moduleCorrector){
        let correctorProfile = await instructorModel.findById(body.moduleCorrector)
        if(!correctorProfile) return next(new AppError('module Corrector is not found', 404))
        
    }
    
    let objIntake = {
        moduleInstructor : body.moduleInstructor,
        moduleName : body.moduleName,
        moduleCorrector : body.moduleCorrector,
        assignBy : req.user.name,
        assignAt : new Date(),
    }

    let objInstructor = {
        intake : intakeId,
        comment : body.comment,
        assignBy : req.user.name,
        assignAt : new Date(),
    }
    
    instructorProfile.intakeList?.push(objInstructor)
    intake.instructorsList.push(objIntake)
    await instructorProfile.save()
    await intake.save()



    
    return res.status(201).json({message:  `instructor : ${instructorProfile.fullName} assign successfully to intake : ${intake.name}`});
       

})


/**
     *  @description Add New Brand
     *  @route /api/v1/intake/instructorAssign/:id
     *  @method POST
     *  @access private (only admin )  
     */
    
static instructorUpdateIntake = catchAsyncError(async function(req, res, next) {
    
    const intakeId = req.params.id
    let body = _.pick(req.body ,
            [
                'moduleInstructor' ,'moduleName' ,
                'moduleCorrector', 'instructorIndex',
            ])
    
    if(!body) return next(new AppError('Data is Missing', 400))
    // body = xssAttack(body)

    let intake = await intakeModel.findById(intakeId)
    if(!intake) return next(new AppError('intake is not found', 404))

    let instructorProfile = await instructorModel.findById(body.moduleInstructor)
    if(!instructorProfile) return next(new AppError('module instructor  is not found',404))

    //   let instructorExists 
    //   intake?.instructorsList?.forEach((ele)=>{
    //     if(ele.moduleInstructor == body.moduleInstructor){
    //         return instructorExists = true
    //     }
    // })

    // if(instructorExists) return next(new AppError('module instructor is already assigned to intake', 409))
    
    if(body.moduleInstructor != body.moduleCorrector){
        let correctorProfile = await instructorModel.findById(body.moduleCorrector)
        if(!correctorProfile) return next(new AppError('module Corrector is not found', 404))
        
    }
    
    let objIntake = {
        moduleInstructor : body.moduleInstructor,
        moduleName : body.moduleName,
        moduleCorrector : body.moduleCorrector,
        updateBy : req.user.name,
        updateAt : new Date(),
    }

    let objInstructor = {
        intake : intakeId,
        comment : body.comment,
        updateBy : req.user.name,
        updateAt : new Date(),
    }

    let instructorIntake 
    intake.instructorsList.forEach((ele)=>{
        if(ele._id == body.instructorIndex){
            instructorIntake = ele
            return
        }
    })

    if(body.moduleInstructor != instructorIntake.moduleInstructor){
        instructorProfile.intakeList?.push(objInstructor)
        let oldInstructor = await instructorModel.findById(instructorIntake.moduleInstructor)
        let index
        oldInstructor.intakeList.forEach((ele,i)=>{
            if(ele.intake == intakeId){
                index = i
                return
            }
        })
        oldInstructor.intakeList[index].comment = 'removed from intake'
        let trash = {
            deletedBy: req.user.name , // userName
            deletedItem : oldInstructor.fullName + ' of ' + intake.name,
        }
    
        await addToTrash(trash)
        await oldInstructor.save()
        await instructorProfile.save()

        let indexIns
        intake.instructorsList.forEach((ele,i)=>{
            indexIns = i
            return
        })

        intake.instructorsList.splice(indexIns,1)
        intake.instructorsList.push(objIntake)
        await intake.save()
        return res.status(201).json({message:  `instructor : ${instructorProfile.fullName} update successfully in intake : ${intake.name}`});


    }else{

        let instructorIntake 
        intake.instructorsList.forEach((ele,index)=>{
            if(ele._id == body.instructorIndex){
                instructorIntake = index
                return
            }
        })

        let objIntake = {
            moduleInstructor : body.moduleInstructor,
            moduleName : body.moduleName,
            moduleCorrector : body.moduleCorrector,
            updateBy : req.user.name,
            updateAt : new Date(),
        }
    
        intake.instructorsList[instructorIntake] = objIntake
        await intake.save()
        return res.status(201).json({message:  `instructor : ${instructorProfile.fullName} update successfully in intake : ${intake.name}`});


    }

    // instructorProfile.intakeList?.push(objInstructor)
    

       

})



/**
    *  @description Add New Brand
    *  @route /api/v1/intake/removeInstructor/:id?instructorId=
    *  @method POST
    *  @access private (only admin )  
*/
    
static removeInstructorIntake = catchAsyncError(async function(req, res, next) {
    
    
    const intakeId = req.params.id
    // const instructorId = req.query.instructorId
    let body = _.pick(req.body ,
            [
                'instructorId'
            ])
    
    if(!body) return next(new AppError('Data is Missing', 400))

    let intake = await intakeModel.findById(intakeId)
    if(!intake) return next(new AppError('intake is not found', 404))
    
    let instructorProfile = await instructorModel.findById(body.instructorId)
    if(!instructorProfile) return next(new AppError('instructor is Not found', 404))

    let instructorExists 
      intake?.instructorsList?.forEach((ele,index)=>{
        if(ele.moduleInstructor == body.instructorId){
            return instructorExists = index
        }
    })
    if(instructorExists == undefined) return next(new AppError('instructor is Not found in intake', 404))
    
    
    instructorProfile?.intakeList.forEach(async (ele)=>{
        if(ele.intake == intakeId){
            // ele.comment = await body.comments
            ele.updateBy = req.user.name
            ele.updateAt = new Date()
            return ;
        }
    })

    intake?.instructorsList?.splice(instructorExists,1)
    await intake.save()
    await instructorProfile.save()
      
    let trash = {
        deletedBy: req.user.name , // userName
        deletedItem : instructorProfile.fullName + ' of ' +  intake.name ,
    }

    await addToTrash(trash)

    return res.status(201).json({message:  `instructor : ${instructorProfile.fullName} remove successfully from intake : ${intake.name} `});
       

})






    /**
     *  @description Update Brand
     *  @route /api/intake/updateProgramIntake/:id
     *  @method PUT
     *  @access private (only admin )  
     */
    static  updateProgramIntake = catchAsyncError(async function(req, res, next) {
    
        const operation = req.query.operation
        const programId = req.query.programId
        const newProgramId = req.query.newProgramId
        const intakeId = req.params.id

        if(!intakeId || !programId) return next(new AppError('program Id and intake Id is required', 400))
        if(!operation) return next(new AppError('operation is required', 400))

        const  intake = await intakeModel.findById(intakeId)        
        if(!intake) return next(new AppError('Intake not found', 404))

        const  program = await programModel.findById(programId)
        if(!program) return next(new AppError('program not found', 404))


        if(operation == 'add'){
            let existsProgram = program?.intakeList.includes(intakeId)
            if(existsProgram) return next(new AppError(`program : ${program.name} is already assigned to intake : ${intake.name}`, 409))
            let obj ={
                program : programId,
                updateBy :req.user.name, // user name
            }
            program?.intakeList.push(intakeId)
            await program.save()
            intake.programList.push(obj)
            await intake.save()

            return res.status(201).json({message:  `program : ${program.name} added successfully to intake : ${intake.name}`});





        }else if(operation == 'remove'){
            let existsProgram = program?.intakeList.indexOf(intakeId)
            if(existsProgram == -1) return next(new AppError(`program : ${program.name} is not found in intake : ${intake.name}`, 404))

            program?.intakeList.splice(existsProgram,1)
            await program.save()
            intake.programList.forEach((ele ,index)=>{
                if(ele.program == programId){
                    intake.programList.splice(index,1)
                    return ;
                }
            })
            await intake.save()

            let trash = {
                deletedBy: req.user.name, // userName
                deletedItem : program.name + ' of ' + intake.name,
            }
        
            await addToTrash(trash)

            return res.status(201).json({message:  `program : ${program.name} remove successfully from intake : ${intake.name}`});




        }else if(operation == 'update'){

            if(!newProgramId) return next(new AppError('new program id is required', 400))

            let newProgram = await programModel.findById(newProgramId)
            if(!newProgram) return next(new AppError('new program not found', 404))

            let existsProgram = program?.intakeList.indexOf(intakeId)
            if(existsProgram == -1) return next(new AppError(`program : ${program.name} is not found in intake : ${intake.name}`, 404))

            let existsNewProgram = newProgram.intakeList.includes(newProgramId)
            if(existsNewProgram) return next(new AppError(`program : ${newProgram.name} already exists in  intake : ${intake.name}`, 400))

            program?.intakeList.splice(existsProgram, 1)
            await program.save()

            newProgram.intakeList.push(intakeId)
            await newProgram.save()

            intake.programList.forEach((ele ,index)=>{
                if(ele.program == programId){
                    intake.programList[index].program = newProgramId
                    intake.programList[index].updateBy = 'administrator'
                    return ;
                }
            })
            await intake.save()

            return res.status(201).json({message:  `change program from  ${program.name} to ${newProgram.name} in ${intake.name} successfully`});

        }else {
            return next(new AppError('operation invalid', 400))
        }

    })


    /**
     *  @description Update Brand
     *  @route /api/brand/:id
     *  @method PUT
     *  @access private (only admin )  
     */
        static  updateIntake = catchAsyncError(async function(req, res, next) {
    
    
            if(!req.params.id) return next(new AppError('id is Missing', 404))
            
            let body = _.pick(req.body, 
                [
                    'name','slot','status',
                    'comment' ,'isActive' ,
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
            // body = xssAttack(body)

            if(body.name){
                body.slug = slugify(body.name)
            }
            body.updateBy =req.user.name
            const  intake = await intakeModel.findByIdAndUpdate(req.params.id, body ,{new: true})
    
            if(!intake) return next(new AppError('Intake not found', 404))
    
            
    
            return res.status(200).json({message : `Intake : ${intake.name} updated successfully`})
    
    
    
        })
    
    /**
     *  @description Delete Brand By Id
     *  @route /api/brand/:id
     *  @method DELETE
     *  @access private   
     */
        static  deleteIntakeById = factory.deleteDocument(intakeModel)
        
    }
    
    
    
    
    module.exports = IntakeController















    
// /**
//      *  @description Add New Brand
//      *  @route /api/v1/intake
//      *  @method POST
//      *  @access private (only admin )  
//      */
    
//         static instructorAssignToIntake = catchAsyncError(async function(req, res, next) {
    
    
//                 const body = _.pick(req.body ,
//                         [
//                             'instructorId' ,'instructorName' ,
//                             'instructorModules' , 'assignBy'
//                         ])
                
//                 if(!body) return next(new AppError('Data is Missing', 400))

//                 const intake = await intakeModel.findById(req.params.id)

//                 if(!intake) return next(new AppError('intake is not found', 404))
                
//                 // const instructorExists = await intakeModel.findById(instructorId)
    
//                 // if(!instructorExists) return next(new AppError('instructor not found', 404))
                
//                 let instructorIsAssign 
//                 intake.instructorsList.forEach(ele=>{
//                     if (ele.instructorId == body.instructorId ){
//                         instructorIsAssign = true;                       
//                     }
//                 })

//                 if(instructorIsAssign) return next(new AppError('instructor is already assigned to intake'));

//                 intake.instructorsList.push(body)
                
//                 await intake.save()

//                 return res.status(201).json({message:  `instructor added successfully to intake ${intake.name}` , instructor : body.instructorName});
    
    
//         })






    