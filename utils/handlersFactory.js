const fs = require('fs');
const path = require('path');

const AppError = require('./appError');
const catchAsyncError = require('../middlewares/catchError');
const slugify = require('slugify');
const categoryModel = require('../models/category.model');
const brandModel = require('../models/brand.model');
const subCategoryModel = require('../models/subCategory.model');

exports.deleteDocument = (model)=> catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const document = await model.findByIdAndDelete(req.params.id)

        if(!document) return next(new AppError('Document not found', 404))
        
        return res.status(201).json({message: 'Document deleted successfully' , documentName: document.name})
    })


exports.getDocumentById = (model)=> catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const  document = await model.findById(req.params.id)
        .select('-password')
        // .populate('category' , 'name')

        if(!document) return next(new AppError('Document not found', 404))

        return res.status(200).json(document)



    })

exports.updateDocument = (model , type='')=> catchAsyncError(async function(req, res, next) {

        let body = req.body
        let files = req.files

        
        if(!req.params.id) return next(new AppError('id is Missing', 404))

        if(body.name){
            body.slug = slugify(body.name)
        }
        if(body.title){
            body.slug = slugify(body.title)
        }
        
        if(type == 'product'){
            if(body.category){
                const categoryExists = await categoryModel.findById(body.category)
                if(!categoryExists) return next(new AppError('Category not found', 404))
            }

            if(body.subCategory){
                const subCategoryExists = await subCategoryModel.findById(body.subCategory)
                if(!subCategoryExists) return next(new AppError('SubCategory not found', 404))
            }

            if(body.brand){
                const brandExists = await brandModel.findById(body.brand)
                if(!brandExists) return next(new AppError('Brand not found', 404))
            }
            
            if(body.priceAfterDiscount >= body.price) return next(new AppError('Price After Discount must be less than Price'))
        
            if(files?.images){

                let imagesArr = []
                let docInDataBase = await model.findById(req.params.id)
                await docInDataBase.images.forEach(element => {
    
                    if(fs.existsSync(path.join(__dirname, `../uploads/${element}`))){
                        fs.unlinkSync(path.join(__dirname, `../uploads/${element}`))
                      }
                }); 
                await files.images.forEach(element => {
                    imagesArr.push(element.filename)                
                });
                body.images = imagesArr
                
            }
    
            if(files?.imageCover){
    
                let docInDataBase = await model.findById(req.params.id)
                if(fs.existsSync(path.join(__dirname, `../uploads${docInDataBase.imageCover}`))){
                    fs.unlinkSync(path.join(__dirname, `../uploads/${docInDataBase.imageCover}`))
                  }
                  body.imageCover = await files.imageCover[0].filename
            }
        }

        if(files?.image){

            let docInDataBase = await model.findById(req.params.id)
            if(fs.existsSync(path.join(__dirname, `../uploads/${docInDataBase.image}`))){
                fs.unlinkSync(path.join(__dirname, `../uploads/${docInDataBase.image}`))
              }
            body.image = await files?.image[0].filename
        }

        if(files?.imageProfile){

            let docInDataBase = await model.findById(req.params.id)
            if(fs.existsSync(path.join(__dirname, `../uploads/${docInDataBase.imageProfile}`))){
                fs.unlinkSync(path.join(__dirname, `../uploads/${docInDataBase.imageProfile}`))
              }
            body.imageProfile = await files.imageProfile[0].filename
        }



        const document = await model.findByIdAndUpdate(req.params.id , body , {new: true})

        if(!document) return next(new AppError('Document not found', 404))
        
        return res.status(201).json({message: 'Document Update successfully' , documentName: document.name || document.title})
    })
