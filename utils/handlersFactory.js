const fs = require('fs');
const path = require('path');
const AppError = require('./appError');
const catchAsyncError = require('../middlewares/catchError');
const slugify = require('slugify');
const trashModel = require('../models/trash.model');


exports.deleteDocument = (model)=> catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('id is Missing', 404))

        const document = await model.findById(req.params.id)
        if(!document) return next(new AppError('Document not found', 404))
        
        if(document.studentsList){
            if(document.studentsList.length > 0){
                return next(new AppError("Sorry, you can't delete this Document because found students in this document", 400))
            }
            
        }
        const documentDeleted = await model.findByIdAndDelete(req.params.id)

        if(document.name){
            const trash = await trashModel.create({deletedItem:document.name   , deletedBy :req.user.name})
            return res.status(201).json({message: `${document.name} deleted successfully `})

        }else if(document.fullName){
            const trash = await trashModel.create({deletedItem:document.fullName   , deletedBy :req.user.name})
            return res.status(201).json({message: `${document.fullName}  deleted successfully`})
        }

        
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
        let files = req.files.imageProfile

        
        if(!req.params.id) return next(new AppError('id is Missing', 400))

        let document = await model.findById(req.params.id)
        if(!document) return next(new AppError('User not found', 404))

        if(body.name){
            body.slug = slugify(body.name)
        }
        if(files){
            if(fs.existsSync(path.join(__dirname, `../uploads/${document.imageProfile}`))){
                fs.unlinkSync(path.join(__dirname, `../uploads/${document.imageProfile}`))
              }
              body.imageProfile = await files[0].filename
        }
        
       

        const documentUpdated = await model.findByIdAndUpdate(req.params.id , body , {new: true})
        
        return res.status(201).json({message: `User : ${documentUpdated.name} Update successfully`})
    })
