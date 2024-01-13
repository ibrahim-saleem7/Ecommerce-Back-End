const _ = require('lodash');
const slugify = require('slugify');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../emails/user.email.js')
const userModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');





class UserController{


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static addUser = catchAsyncError(async function(req, res, next) {


            const redirectLink  = req.header('redirectLink')
            let body = _.pick(req.body, ['name' , 'password' , 'email' ,'role' ],)
            const image = req.files?.imageProfile
            let pass = body.password
            const userExists = await userModel.findOne({$or: [{email: body.email}, {name: body.name}]})
            if(userExists) return next(new AppError(`User : ${body.name} already exists`, 409))


            if(!image) return next(new AppError(`image Profile is required`, 400))

            body.imageProfile = await image[0].filename
            
            
            body.slug = await slugify(body.name)

            body.password = await bcryptjs.hash(body.password,Number(process.env.SALT))
            const newUser = await userModel.create(body)

            sendEmail({email:body.email, redirectLink, subject: "Email Confirmation",pass,userName:body.name})
            return res.status(201).json({message:  `User : ${newUser.name} added successfully`});


    })


/**
 *  @description Get All Users 
 *  @route /api/users
 *  @method GET
 *  @access private (admin only)
 */

    static  getAllUsers = catchAsyncError(async function(req, res, next) {


            let {pageSize, pageNumber , keyword } = req.query
            let totalPages
            const search = {}

            // // Pagination 
            // pageSize = Number(req.query.pageSize) ||  20
            // pageNumber = Number(req.query.pageNumber) || 1

            // Search Keywords
            keyword = keyword || ''
            search.$or = [
                {name: {$regex: keyword, $options: 'i'}},
                {email: {$regex: keyword, $options: 'i'}},
            ]

            // const countDocuments = await userModel.countDocuments()
            const users = await userModel.find()
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)
            .find(search)
            .select('-password -__v')

            // if(users.length < pageSize ){
            //     totalPages  = users.length>pageSize? Math.ceil(users.length/pageSize) : 1
            // }else{
            //     totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
            // }

            return res.status(200).json(
                {
                    // totalPages,
                    requestResults: users.length,
                    // pageNumber,
                    // pageSize,
                    users

                })
        

    })




/**
 *  @description Get User By Id
 *  @route /api/user/:id
 *  @method GET
 *  @access private (admin and user himself)   
 */
    static  getUserById = factory.getDocumentById(userModel)
    
/**
 *  @description Update User
 *  @route /api/user/:id
 *  @method PUT
 *  @access private (user himself)  
 */
    static  updateUser = catchAsyncError(async function(req, res, next){

        let files = req.files.imageProfile
        
        if(!req.params.id) return next(new AppError('id is Missing', 400))
        
        let user = await userModel.findById(req.params.id)
        if(!user) return next(new AppError('User not found', 404))
        
        let body = _.pick(req.body, ['name' , 'password' ,'role' , 'isDeleted' ],)

        if(files){
            if(fs.existsSync(path.join(__dirname, `../uploads/${user.imageProfile}`))){
                fs.unlinkSync(path.join(__dirname, `../uploads/${user.imageProfile}`))
              }
              body.imageProfile = await files[0].filename
        }

        if(body.password){
            body.password = await bcryptjs.hash(body.password,Number(process.env.SALT))
        }

        const userUpdated = await userModel.findByIdAndUpdate(req.params.id, body,{new: true})


        return res.status(201).json({message: `User : ${userUpdated.name} Update successfully`})

    })


    

/**
 *  @description Delete User By Id
 *  @route /api/user/:id
 *  @method DELETE
 *  @access private  (admin and user himself) 
 */
    static  deleteUserById = factory.deleteDocument(userModel)
    
}




module.exports = UserController