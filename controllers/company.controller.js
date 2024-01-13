
const _ = require('lodash');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const companyModel = require('../models/company.model');
const slugify = require('slugify');
const salesModel = require('../models/sales.model');
const addToTrash = require('../utils/addToTrash');
const programModel = require('../models/program.model');








class CompanyController{


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static addCompany = catchAsyncError(async function(req, res, next) {

        let body = _.pick(req.body , 
                [
                        'name', 'address', 'phoneNumbers',
                        'email','companyField','numberOfEmployees',
                        'BDName','programs','representativeOfCompany',
                        'status','comment','isActive'
                ])

        const company = await companyModel.findOne({slug : slugify(body.name)})
        if(company) return next(new AppError(`Company : ${body.name} already exists`,409))
        
        body.slug = await slugify(body.name)
        
        let BDName = await salesModel.findById(body.BDName)
        if(!BDName) return next(new AppError(`BDName  does not exist`,404))

        
        // body = xssAttack(body)

        body.createdBy =req.user.name
        const newCompany = await companyModel.create(body)

        let deal = {
                deal:newCompany._id,
        }
        BDName.sellerDealsCompanies.push(deal)
        await BDName.save()

        return res.status(201).json({message : `Company : ${newCompany.name} added successfully`})

    })



/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static getCompanyById = catchAsyncError(async function(req, res, next) {

        if(!req.params.id) return next(new AppError('id is Missing', 404))
    
            const  company = await companyModel.findById(req.params.id)
            .populate('BDName' ,'name')
            .populate('programs.program' ,'name programAbbreviation')
            if(!company) return next(new AppError('Company is not found', 404))
    
            return res.status(200).json(company)


    })


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static getAllCompanies = catchAsyncError(async function(req, res, next) {

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
            ]
    
            const companies = await  companyModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            .populate('BDName' ,'name')
            .populate('programs.program' ,'name programAbbreviation' )
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
                    requestResults: companies.length,
                    // pageNumber,
                    // pageSize,
                    companies
    
                })

    })


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static updateCompany = catchAsyncError(async function(req, res, next) {

        if(!req.params.id) return next(new AppError('id is Missing', 404))
        
        let body = _.pick(req.body, 
                [
                        'name', 'address', 'phoneNumbers',
                        'email','companyField','numberOfEmployees',
                        'BDName','status','comment','isActive',
                ])
        
    
        const company = await  companyModel.findById(req.params.id)
        if(!company) return next(new AppError('Company is not found', 404))

        body.updatedBy =req.user.name

        if(body.BDName){
                if(body.BDName != company.BDName){
                        let BDName = await salesModel.findById(body.BDName)
                        let removeDeal = await salesModel.findById(company.BDName)
                        if(!BDName) return next(new AppError(`BDName  does not exist`,404))
                        let deal ={
                                deal : req.params.id        
                        }
        
                        BDName.sellerDealsCompanies.push(deal)
                        await BDName.save()
        
                        removeDeal.sellerDealsCompanies.forEach(async(ele,index)=>{
                                if(ele.deal == req.params.id){
                                    removeDeal.sellerDealsCompanies.splice(index,1)
                                    await removeDeal.Save()
                                    let trash ={
                                        deletedItem : company.name + ' of ' + removeDeal.name,
                                        deletedBy : req.user.name
                                    }
                                    await addToTrash(trash)
                                    return
                                    
                                }
                        })
                }
        }
        if(body.name){
                body.slug = slugify(body.name)
        }
        
        // body = xssAttack(body)

        const companyUpdated = await companyModel.findByIdAndUpdate(req.params.id,body,{new:true})
            
           
            return res.status(200).json(
                {
                   message : `Company ${companyUpdated.name} updated successfully `
    
                })

    })

/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static updateProgram = catchAsyncError(async function(req, res, next) {

        const companyId = req.params.id;
        const operation = req.query.operation

        const body = _.pick(req.body, 
            [
              'program', 'price'
            ])
        
        if(!companyId) return next(new AppError('company Id is Missing', 400))
        if(!operation) return next(new AppError('operation is required', 400))
        if(!body) return next(new AppError('data is Missing', 400))
        
        let  company = await companyModel.findById(companyId)
        if(!company) return next(new AppError('company not found', 404))

        if(operation == 'add'){
            if(!body) return next(new AppError(' Data is Missing', 400))
            let program = await programModel.findById(body.program)
            if(!program) return next(new AppError('program not found', 404))
            
            let checkProgram =false
            company.programs?.forEach((ele)=>{
                if(ele.program.toString() == body.program){
                    return checkProgram =true;
                }
            })

            console.log(checkProgram)
            if(checkProgram) return next(new AppError(`program : ${program.name} is already exists in company : ${company.name}  `,409))

            company.programs.push(body)
            company.updatedBy = req?.user?.name
            await company.save()

            return res.status(201).json(
                {
                    message : `program : ${program.name} added to company : ${company.name} successfully`, 
                })






        }else if(operation == 'remove'){

            if(!body) return next(new AppError(' Data is Missing', 400))
            let program = await programModel.findById(body.program)
            if(!program) return next(new AppError('program not found', 404))

            let index
            company.programs.forEach((ele,i)=>{
                if(ele.program.toString() === body.program){
                    return index = i
                }
            })

            company.programs.splice(index, 1)
            company.updatedBy = req?.user?.name
            await company.save()

            let trash ={
                deletedItem : program.name + ' of ' + company.name,
                deletedBy : req?.user?.name ,
            }
            await addToTrash(trash)

            return res.status(201).json(
                {
                    message : `program : ${program.name} remove from company : ${company.name} successfully`, 
                })


        }else if(operation == 'update'){
            if(!body) return next(new AppError(' Data is Missing', 400))
            let program = await programModel.findById(body.program)
            if(!program) return next(new AppError('program not found', 404))

            let index 
            company.programs.forEach((ele,i)=>{
                if(ele.program.toString() === body.program){
                    return index = i
                }
            })

            if(index == undefined) return next(new AppError('program not found in company', 404))

            company.programs[index] = body
            company.updatedBy = req?.user?.name
            await company.save()

            return res.status(201).json(
                {
                    message : `program : ${program.name} update in company : ${company.name} successfully`, 
                })
            

        }else {
            return next(new AppError('operation invalid', 400))
        }


    })
/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static updatedRepresentative= catchAsyncError(async function(req, res, next) {

        const companyId = req.params.id;
        const operation = req.query.operation

        const body = _.pick(req.body, 
            [
              'name', 'phoneNumber','position','email'
            ])
        
        if(!companyId) return next(new AppError('company Id is Missing', 400))
        if(!operation) return next(new AppError('operation is required', 400))
        if(!body) return next(new AppError('data is Missing', 400))
        
        let  company = await companyModel.findById(companyId)
        if(!company) return next(new AppError('company not found', 404))

        if(operation == 'add'){
            if(!body) return next(new AppError(' Data is Missing', 400))
            
            let checkRepresentative =false
            company.representativeOfCompany?.forEach((ele)=>{
                if(ele.name == body.name || ele.email == body.email || ele.phoneNumber == body.phoneNumber ){
                    return checkRepresentative =true;
                }
            })

            if(checkRepresentative) return next(new AppError(`Representative : ${body.name} is already exists in representative Of Company : ${company.name}  `,409))

            company.representativeOfCompany.push(body)
            company.updatedBy = req?.user?.name
            await company.save()

            return res.status(201).json(
                {
                    message : `Representative : ${body.name} added to representative Of Company : ${company.name} successfully`, 
                })



        }else if(operation == 'remove'){

            if(!body) return next(new AppError(' Data is Missing', 400))

            let index
            company.representativeOfCompany.forEach((ele,i)=>{
                if(ele.name == body.name && ele.email == body.email ){
                    return index =i;
                }
            })

            company.representativeOfCompany.splice(index, 1)
            company.updatedBy = req?.user?.name
            await company.save()

            let trash ={
                deletedItem : body.name + ' of ' + company.name,
                deletedBy : req?.user?.name ,
            }
            await addToTrash(trash)

            return res.status(201).json(
                {
                    message : `Representative : ${body.name} remove from  representative Of Company : ${company.name} successfully`, 
                })


        }else if(operation == 'update'){
            if(!body) return next(new AppError(' Data is Missing', 400))

            let index 
            company.representativeOfCompany.forEach((ele,i)=>{
                if(ele.name == body.name || ele.email == body.email || ele.phoneNumber == body.phoneNumber ){
                    return index =i
                }
            })

            if(index == undefined) return next(new AppError('Representative not found in company', 404))

            company.representativeOfCompany[index] = body
            company.updatedBy = req?.user?.name
            await company.save()

            return res.status(201).json(
                {
                    message : `Representative : ${body.name} update in representative Of Company : ${company.name} successfully`, 
                })
            

        }else {
            return next(new AppError('operation invalid', 400))
        }


    })

    
}




module.exports = CompanyController