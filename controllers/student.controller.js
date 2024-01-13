const _ = require('lodash');
const slugify = require('slugify');
const intakeModel = require('../models/intake.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const studentModel = require('../models/student.model');
const salesModel = require('../models/sales.model');
const programModel = require('../models/program.model');
const addToTrash = require('../utils/addToTrash');
const specializationModel = require('../models/specialization.model');
const companyModel = require('../models/company.model');
const xssAttack = require('../middlewares/xssAttack');












class StudentController{


/**
     *  @description Add New Brand
     *  @route /api/v1/intake
     *  @method POST
     *  @access private (only admin )  
     */
    
        static addStudent = catchAsyncError(async function(req, res, next) {
    
    
                let body = _.pick(req.body ,
                        [
                            'fullName','firstName','lastName' ,
                            'BDName','OrgName' ,'phoneNumber',
                            'personalEmail','businessEmail' ,'programEnrolled',
                            'specialization','studentModules', 'studentFinancial',
                            'status','comment','isActive' ,
                        ])
                
                if(!body) return next(new AppError('Data is Missing', 400))
                
                const studentExists = await studentModel.findOne(
                    {$or: [
                        {phoneNumber: body.phoneNumber},
                        {personalEmail: body.personalEmail},
                        {slug: slugify(body.fullName)}
                    ]}
                    )
    
                if(studentExists) return next(new AppError(`student : ${body.fullName} already exists`, 409))

                let seller = await salesModel.findById(body?.BDName)
                if(!seller) return next(new AppError('seller not  found', 404))
                
                
                 
                let number = await studentModel.countDocuments()
                body.slug = slugify(body.fullName)
                body.number = (number+1000)
                body.institute = 'CSB'
                body.registrationNumber =  body.institute
                body.studentFinancial.paid = body.studentFinancial.reservation
                body.createdBy = req.user.name
                const newStudent = await studentModel.create(body).then(async(student) =>{
                    let deal= {
                        deal: student?._id.toString(),
                    }
                    await seller.sellerDealsStudent.push(deal)
                    await seller.save()

                    body.specialization?.forEach(async(ele)=>{
                        let specialization = await specializationModel.findById(ele)
                        if(specialization){
                            specialization.studentsList.push(student?._id.toString())
                            await specialization.save()
                        }
                    })
    
                    let programAbbreviation =''
                    body?.programEnrolled?.forEach(async(ele , index)=>{
                        let program = await programModel.findById(ele.program)
                        if(program){
                            program.studentList.push(student?._id.toString())
                            programAbbreviation += program.programAbbreviation
                            await program.save()
                            if((index+1) == body.programEnrolled.length){
                                student.registrationNumber = await body.institute+'-'+programAbbreviation+'-'+body.firstName[0].toUpperCase()+body.lastName[0].toUpperCase()+'-'+body.number+'UK'
                                await student.save()

                                let company = await companyModel.findById(body.OrgName)
                                if(company){
                                    company.students.push(student?._id.toString())
                                    await company.save()
                                }
                                return res.status(201).json(
                                    {
                                        message:  `Student : ${student.fullName} registration successfully` ,
                                        registrationNumber :student.registrationNumber,
                                    });
                            }
                        }
                    })
                        
                }).catch((error)=>{
                    return next(new AppError(`Error during sand request ${error}`, 500))
                })
               

                
    
    
        })


    
    /**
     *  @description Get All Brands 
     *  @route /api/brand
     *  @method GET
     *  @access public
     */
    
        static  getAllStudents = catchAsyncError(async function(req, res, next) {
    
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
                {registrationNumber: {$regex: keyword, $options: 'i'}},
                {fullName: {$regex: keyword, $options: 'i'}},
                {phoneNumber: {$regex: keyword, $options: 'i'}},
            ]
    
            const students = await  studentModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            .populate('BDName specialization programEnrolled OrgName' ,'name')
            .populate('programEnrolled.program', 'name')
            // .populate('status', 'name value')
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
                    requestResults: students.length,
                    // pageNumber,
                    // pageSize,
                    students
    
                })
        
    
    })
    
    
    
    
    
    
    /**
     *  @description Get student By Id
     *  @route /api/student/:id
     *  @method GET
     *  @access public   
     */
        static  getStudentById = catchAsyncError(async function(req, res, next) {
    
    
            if(!req.params.id) return next(new AppError('id is Missing', 404))
    
            const  student = await studentModel.findById(req.params.id)
            .populate('BDName programEnrolled OrgName' ,'name')
            .populate('programEnrolled.program', 'name')
            .populate('specialization', 'name modules')
            // .populate('intakeList.intake',)
            .populate({
            path: 'intakeList.intake',
            populate: {
                path: 'slot',
            }
            })
            .populate({
            path: 'intakeList.intake',
            populate: {
                path: 'instructorsList',
                populate: {
                path: 'moduleInstructor',
                select: 'firstName lastName'
            }
            }
            })
            // .populate('intakeList.intake.slot',)

            if(!student) return next(new AppError('student not found', 404))
    
            return res.status(200).json(student)
    
    
    
        })

        
          /**
     *  @description Update Brand
     *  @route /api/student/attendee
     *  @method PUT
     *  @access private (only admin )  
     */
          static  attendeeStudent = catchAsyncError(async function(req, res, next) {
            
            const body = _.pick(req.body, 
                [
                    'studentList'
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))

            if(!body.studentList[0].date ||
                !body.studentList[0].status ||
                !body.studentList[0].student ||
                !body.studentList[0].moduleName )
                 return next(new AppError('Data is Missing', 400))
                  

            await body.studentList?.forEach(async(ele,index) =>{
                let  student = await studentModel.findById(ele.student)

                if(student){
                    let attended = {
                        status : ele.status,
                        date : ele.date,
                        attendeeBy : req.user.name,
                    }

                    student?.studentModules?.forEach(async(module,i) =>{

                        if(module.moduleName == ele.moduleName){
                            student.studentModules[i].attendee.push(attended)
                            await student.save()

                        }                       
                    })

                    if(body.studentList.length == (index+1)){

                        return res.status(201).json(
                            {
                                message : 'attendee updated successfully' , 
                            })
                    }

                    
                }

            })
               
           
    
        })


/**
 *  @description Get student By Id
 *  @route /api/student/updateProgramStudent/:id
 *  @method GET
 *  @access public   
 */
        static  updateProgramStudent = catchAsyncError(async function(req, res, next) {

            const studentId = req.params.id;
            const operation = req.query.operation

            const body = _.pick(req.body, 
                [
                  'program'
                ])
            
            if(!studentId) return next(new AppError('student Id is Missing', 400))
            if(!operation) return next(new AppError('operation is required', 400))
            if(!body) return next(new AppError('program is required', 400))
            
            let  student = await studentModel.findById(req.params.id)
            if(!student) return next(new AppError('student not found', 404))

            if(operation == 'add'){
                if(!body) return next(new AppError(' Program Id is required', 400))
                let program = await programModel.findById(body.program)
                if(!program) return next(new AppError('program not found', 404))
                
                let checkSpecialization =  student.specialization?.includes(program.specialization)

                if(!checkSpecialization) return next(new AppError(`program : ${program.name} is not from specialization student : ${student.fullName}  `,404))
                let objProgram = {
                        program: body.program,
                        assignBy : req.user.name, // req.user
                        assignAt : new Date(),
                    }
                student?.programEnrolled?.push(objProgram)
                let registrationNo =  student.registrationNumber.split('-')
                student.registrationNumber = registrationNo[0]+'-'+registrationNo[1]+program.programAbbreviation+'-'+registrationNo[2]+'-'+registrationNo[3]
                await student.save()
                program.studentList.push(studentId)
                await program.save()
                return res.status(201).json(
                    {
                        message : `program : ${program.name} added to student : ${student.fullName} successfully`, 
                    })






            }else if(operation == 'remove'){

                if(!body) return next(new AppError('Program Id is required', 400))
                let program = await programModel.findById(body.program)
                if(!program) return next(new AppError('program not found', 404))

                student?.programEnrolled?.forEach(async(ele,index)=>{
                    if(ele.program == body.program){
                        student?.programEnrolled?.splice(index, 1)
                        let registrationNo =  student.registrationNumber.split('-')
                        let removeProgramAbbr = registrationNo[1].replace(program.programAbbreviation, '')
                        student.registrationNumber = registrationNo[0]+'-'+removeProgramAbbr+'-'+registrationNo[2]+'-'+registrationNo[3]
                        
                        program.studentList.forEach(async(ele,index)=>{
                            if(ele == studentId){
                                program.studentList.splice(index, 1)
                            }
                        })
                        let trash ={
                            deletedItem : program.name + ' of ' + student.fullName,
                            deletedBy : req.user.name , // userName
                        }
                        await addToTrash(trash)

                        return 
                    }
                })

                await student.save()
                await program.save()

                return res.status(201).json(
                    {
                        message : `program : ${program.name} remove from student : ${student.fullName} successfully`, 
                    })


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
        static  updateInfoStudent = catchAsyncError(async function(req, res, next) {
    
    
            if(!req.params.id) return next(new AppError('id is Missing', 404))
            
            let body = _.pick(req.body, 
                [
                    'fullName','firstName','lastName' ,
                    'BDName','OrgName' ,'phoneNumber',
                    'personalEmail','businessEmail' ,
                    'status','comment','isActive' , 
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))

            let  student = await studentModel.findById(req.params.id)
            if(!student) return next(new AppError('Student not found', 404))

            if(body.OrgName){
                if(student.OrgName != body.OrgName){
                    let newCompany = await companyModel.findById(body.OrgName)
                    if(!newCompany) return next(new AppError('company not found',404))

                    let company = await companyModel.findById(student.OrgName)
                    if(!company) return next(new AppError('company not found', 404))

                    company.students.splice(req.params.id, 1)
                    await company.save()

                    

                    newCompany.students.push(req.params.id)
                    await newCompany.save()
                }
            }
            if(body.fullName){
                body.slug = slugify(body.fullName)
            }
            if(body.BDName){
                if(body.BDName != student.BDName){
                    let newSales = await salesModel.findById(body.BDName)
                    if(!newSales) return next(new AppError('BD Name not found', 404))
    
                    let sales = await salesModel.findById(sales.BDName)
                    if(!newSales) return next(new AppError('BD Name not found', 404))
    
                    sales.sellerDealsStudent.forEach(async(ele,index)=>{
                        if(ele.deal == req.params.id){
                            sales.sellerDealsStudent.splice(index, 1)
                            await sales.save()
                            return
                        }
                    })
                    newSales.sellerDealsStudent.push({
                        deal : req.params.id
                    })
                    await newSales.save()
                }
            }
            
 
            let registrationNo = student.registrationNumber.split('-')
            let fLetter,
            lLetter

            if(body.firstName || body.lastName ){
                fLetter= body?.firstName?.toUpperCase()||student.firstName.toUpperCase()
                lLetter = body?.lastName?.toUpperCase()||student.lastName.toUpperCase()
                body.registrationNumber =  registrationNo[0]+'-'+registrationNo[1]+'-'+fLetter[0]+lLetter[0]+'-'+registrationNo[3]
            }

            body.updateBy =req.user.name

            const studentUpdate = await studentModel.findByIdAndUpdate(req.params.id,body,{new:true})
    
            return res.status(201).json(
                {
                    message : `student : ${studentUpdate.fullName} updated successfully`,
                    registrationNumber : studentUpdate.registrationNumber
                })
    
        })


    /**
     *  @description Update Brand
     *  @route /api/student/:id?installmentId=
     *  @method PUT
     *  @access private (only admin )  
     */
        static  updateInstallment = catchAsyncError(async function(req, res, next) {
            
            if(!req.params.id) return next(new AppError('id is Missing', 404))

            let body = _.pick(req.body, 
                [
                    "installmentNumber",
                    "installmentValue",
                    "installmentStatus",
                    "installmentDate",
                    "installmentCountry"
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
             

            let student = await studentModel.findById(req.params.id)
            if(!student) return next(new AppError('Student not found', 404))


            let paid = student.studentFinancial.paid
            if(body.installmentStatus.toLowerCase().trim() === 'paid' && student.studentFinancial.installments[(body.installmentNumber-1)].installmentStatus.toLowerCase().trim()  === 'not paid'){
                paid += body.installmentValue 
                student.studentFinancial.paid =  paid
                student.studentFinancial.installments[(body.installmentNumber-1)] =  body

            }
            if(body.installmentStatus.toLowerCase().trim() === 'not paid' && student.studentFinancial.installments[(body.installmentNumber-1)].installmentStatus.toLowerCase().trim()  === 'paid'){
                paid -= body.installmentValue 
                student.studentFinancial.paid =  paid
                student.studentFinancial.installments[(body.installmentNumber-1)].installmentCountry =  ''
                student.studentFinancial.installments[(body.installmentNumber-1)].installmentDate =  body.installmentDate
                student.studentFinancial.installments[(body.installmentNumber-1)].installmentStatus =  body.installmentStatus
            }

            student.studentFinancial.updateBy = req.user.name
            student.studentFinancial.updateAt = new Date()

            await student.save()


    
            return res.status(201).json(
                {
                    message : `student : ${student.fullName}  updated installment successfully` 
                })
    
    
    
        })
    
    /**
     *  @description Update Brand
     *  @route /api/student/:id?installmentId=
     *  @method PUT
     *  @access private (only admin )  
     */
        static  updateFinancialStudent = catchAsyncError(async function(req, res, next) {
            
            if(!req.params.id) return next(new AppError('id is Missing', 404))

            let body = _.pick(req.body, 
                [
                    "studentFinancial"
                    
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
             

            let student = await studentModel.findById(req.params.id)
            if(!student) return next(new AppError('Student not found', 404))

            student.studentFinancial = body.studentFinancial
            student.studentFinancial.updateBy = req.user.name
            student.studentFinancial.updateAt = new Date()

            await student.save()


    
            return res.status(201).json(
                {
                    message : `student : ${student.fullName}  updated Financial successfully` 
                })
    
    
    
        })
    




/**
     *  @description Update Brand
     *  @route /api/brand/:id?moduleId=
     *  @method PUT
     *  @access private (only admin )  
     */
          static  addModuleStudent = catchAsyncError(async function(req, res, next) {
    

            const studentId = req.params.id // index module in array modules
            if(!studentId) return next(new AppError('student id is Missing', 400))
            
            let body = _.pick(req.body, 
                [
                    'moduleName'
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
             

            let  student = await studentModel.findById(studentId)
            .populate('specialization')
            if(!student) return next(new AppError('Student not found', 404))
            

            let checkModuleInSpecialization = false
            student.specialization.forEach(async(ele) =>{
                if(ele.modules.includes(body.moduleName.toLowerCase())){
                    checkModuleInSpecialization = true
                    return
                }
            })

            if(!checkModuleInSpecialization) return next(new AppError(`module : ${body.moduleName} is not found in  student specializations `, 404))

            let modelExists 
            student.studentModules?.forEach(ele =>{
                if(ele.moduleName == body.moduleName.toLowerCase()){
                    modelExists = true
                    return
                }
            })

            if(modelExists) return next(new AppError(`module : ${body.moduleName} already assigned to student : ${student.fullName}`, 409))

            let objModule = {
                moduleName : body.moduleName,
                assignBy : req.user.name, // username
                assignAt : new Date()
            }
            student.studentModules.push(objModule)

            
            await student.save()
    
            return res.status(201).json(
                {
                    message : `module : ${body.moduleName} added to student : ${student.fullName} successfully` , 
                })
    
    
    
        })




    /**
     *  @description Update Brand
     *  @route /api/brand/:id?moduleId=
     *  @method PUT
     *  @access private (only admin )  
     */
        static  updateModuleStudent = catchAsyncError(async function(req, res, next) {
    

            const moduleId = req.query.module // index module in array modules
            const studentId = req.params.id // index module in array modules
            if(!studentId) return next(new AppError('student id is Missing', 400))
            if(!moduleId) return next(new AppError('module Id id is Missing', 400))
            
            let body = _.pick(req.body, 
                [
                    'moduleAssignment' 
                ])
            
            if(!body) return next(new AppError('Data is Missing', 400))
             

            let  student = await studentModel.findById(studentId)
            if(!student) return next(new AppError('Student not found', 404))
            
            student.studentModules[moduleId].moduleAssignment = await body.moduleAssignment 
            student.studentModules[moduleId].updateBy = req.user.name // userName
            student.studentModules[moduleId].updateAt = new Date()
            
            await student.save()
    
            return res.status(201).json(
                {
                    message : `student : ${student.fullName} updated successfully` , 
                })
    
    
    
        })



    /**
     *  @description Update Brand
     *  @route /api/brand/:id?moduleId=
     *  @method PUT
     *  @access private (only admin )  
     */
        static  deleteModuleStudent = catchAsyncError(async function(req, res, next) {
    

            const moduleId = req.query.module // index module in array modules
            const studentId = req.params.id 
            if(!studentId) return next(new AppError('student id is Missing', 400))
            if(!moduleId) return next(new AppError('module Id id is Missing', 400))
            
            
            let  student = await studentModel.findById(studentId)
            if(!student) return next(new AppError('Student not found', 404))
            if(student.studentModules[moduleId].moduleAssignment.assignmentStatus == 'received'){
                return next(new AppError(`sorry, can't delete the module: ${student.studentModules[moduleId].moduleName} because the Assignment is found  in the module`, 400))
            }else{
                let deletedItem = {
                    deletedBy: req.user.name, // userName
                    deletedItem : student.studentModules[moduleId].moduleName + ' of ' + student.fullName,
                }

                student.studentModules.splice(moduleId, 1)
                addToTrash(deletedItem)
                await student.save()
                
                return res.status(201).json(
                    {
                        message : `module : ${student.studentModules[moduleId].moduleName} deleted from  student : ${student.fullName} successfully` , 
                    })
            }
            
            
    
    
    
        })
    

    /**
     *  @description Update Brand
     *  @route /api/brand/:id?moduleId=
     *  @method PUT
     *  @access private (only admin )  
     */
        static  updateSpecializationStudent = catchAsyncError(async function(req, res, next) {
    

            const studentId = req.params.id 
            const operation = req.query.operation

            if(!studentId) return next(new AppError('student id is Missing', 400))
            if(!operation) return next(new AppError('operation is required', 400))
            
            const body = _.pick(req.body, 
                [
                  'specialization'
                ])

            let  student = await studentModel.findById(studentId)
            if(!student) return next(new AppError('Student not found', 404))
            
            let specialization = await specializationModel.findById(body.specialization)
            if(!specialization) return next(new AppError('Specialization not found', 404))

            if(operation == 'add'){
                if(student.specialization.includes(body.specialization)){
                    return next(new AppError(`Specialization : ${specialization.name} already exists in student : ${student.fullName}`, 409))
                }

                student.specialization.push(body.specialization)
                specialization.studentsList.push(studentId)
                await specialization.save()
                await student.save()
                return res.status(201).json(
                    {
                        message : `Specialization : ${specialization.name} added to student : ${student.fullName} successfully` , 
                    })


            }else if(operation == 'remove'){
                if(!student.specialization.includes(body.specialization)){
                    return next(new AppError(`Specialization : ${specialization.name} does not exists in student : ${student.fullName}`, 404))
                }
                student.specialization.splice(student.specialization.indexOf(body.specialization), 1)
                specialization.studentsList.splice(specialization.studentsList.indexOf(studentId), 1)
                await student.save()
                await specialization.save()

                let trash = {
                    deletedBy: req.user.name, // userName
                    deletedItem : specialization.name + ' of ' + student.fullName,
                }

                await addToTrash(trash)

                return res.status(201).json(
                    {
                        message : `Specialization : ${specialization.name} deleted from student : ${student.fullName} successfully` , 
                    })
            }else {
                return next(new AppError('operation invalid', 400))
            }
            
    
        })
    


    
    /**
     *  @description Delete Brand By Id
     *  @route /api/brand/:id
     *  @method DELETE
     *  @access private   
     */
        static  deleteIntakeById = factory.deleteDocument(intakeModel)
        
    }
    
    
    
    
    module.exports = StudentController