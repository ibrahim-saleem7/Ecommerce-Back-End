const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')


const catchAsyncError = require("../middlewares/catchError.js")
const AppError = require("../utils/appError.js")
const sendEmail = require('../emails/user.email.js')
const generateCode = require('../utils/generateCode.js')
const userModel = require('../models/user.model')
const loginFailedModel = require('../models/loginFailed.model.js')
const generateOTP = require('../utils/generateOTP')








class AuthController{



/**
 *  @description Login The User
 *  @route /api/auth/login
 *  @method POST
 *  @access public 
 */

    static login = catchAsyncError(async function(req, res, next){

            const body = _.pick(req.body , ['email' , 'password'])

            const user = await userModel.findOne({ email : body.email })
            if(!user) return next(new AppError("Invalid email or password", 400))
            
            const matchPassword = await bcrypt.compare(body.password, user.password)
            if(!matchPassword) return next(new AppError("Invalid email or password", 400))
            
            if(user.isDeleted) return next(new AppError("you are not allowed", 403))
            if(!user.isConfirm) return next(new AppError("please confirm your account", 403))
            if(user.blocked) return next(new AppError("user blocked",403))
            
            let OTP =  generateOTP()

            sendEmail({email:body.email, subject: "Auth Login" , OTP})

            user.OTP = OTP
            await user.save()

            
           return res.status(200).json({id:user._id})
        
    })



/**
 *  @description Login The User
 *  @route /api/auth/login
 *  @method POST
 *  @access public 
 */

    static checkUser = catchAsyncError(async function(req, res, next){

            const body = _.pick(req.body , ['id'])

            const user = await userModel.findById(body.id)
            if(!user) return next(new AppError("User not found", 404))

            if(user.isDeleted) return next(new AppError("you are not allowed", 403))
            if(user.blocked) return next(new AppError("user blocked",403))
            
           return res.status(200).json({id:user._id})
        
    })

/**
 *  @description Login The User
 *  @route /api/auth/otp
 *  @method POST
 *  @access public 
 */

    static otp = catchAsyncError(async function(req, res, next){

            const body = _.pick(req.body , ['code'])
            if(!req.params.id) return next(new AppError("user id is required", 400))
            let user = await userModel.findById(req.params.id)
            if(!user) return next(new AppError("user not found", 404))
            if(user.blocked) return next(new AppError("user blocked",403))
            
            if(body.code != user.OTP) {

               if(user.loginFailedNo == 2) {
                  user.OTP = undefined
                  // user.loginFailedNo = 0
                  user.blocked = true
                  await user.save()
                  return next(new AppError('invalid code', 400))
               }

               let loginFailed = {
                  user :user._id
               }
               await loginFailedModel.create(loginFailed)
               user.loginFailedNo = (user.loginFailedNo+1)
               await user.save()

               
               return next(new AppError('invalid code', 400))
            }
            
            const token = generateToken({
               id : user._id , role : user.role ,
               name : user.name, 
           })
            user.OTP = undefined
            user.loginFailedNo = 0
            await user.save()

            return res.status(200).json(token)
        
    })

    /**
 *  @description Forgot Password User
 *  @route /api/auth/forgot-password
 *  @method POST
 *  @access public 
 */

    static forgotPassword = catchAsyncError(async function (req , res , next) {
        
        const  redirectLink  = req.header('redirectLink')
        const codeNum = generateCode()

        const email = req.body.email

        let user = await userModel.findOne({ email : email })
        if (!user) return next(new AppError("email does not exist", 404))

        if(user.isDeleted) return next(new AppError('you are not allowed' ,403))
        if(user.blocked) return next(new AppError("user blocked",403))

        const token = jwt.sign({ id: user._id, email: user.email } ,process.env.JWT_SECRET_KEY+ user.password ,{ expiresIn : '10m'})
        const link = {
         id:user._id,
         token : token
        }
        user.codePass =  codeNum
        await user.save()
      //   let dd = `http://localhost:8070/api/v1/auth/reset-password/${user._id}/${token}`
        sendEmail({ email, redirectLink, codeNum ,subject: "Forget Password"})
        return res.status(200).json({message : 'The code has been sent to your email, please check your email' , link})
      //   return res.status(200).json(dd)

    })


    /**
 *  @description Reset Password User
 *  @route /api/auth/reset-password/:id/:token
 *  @method POST
 *  @access public 
 */

    static resetPassword = catchAsyncError(async function (req , res , next) {

        const user = await userModel.findById(req.params.id)

        if(!user) return next(new AppError("email does not exist", 404))
        if(user.blocked) return next(new AppError("user blocked",403))

        const body = _.pick(req.body , ['password' , 'code'])
        
        const toke = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY+ user.password ) 

        if(user.codePass != body.code) return next(new AppError("code is incorrect", 400))

        user.codePass = undefined
        user.password = await bcrypt.hash(body.password , Number(process.env.SALT))
        await user.save()

        return res.status(201).json({ email : user.email , message : 'The password is reset successfully'})


        })




    /**
 *  @description Change Password User
 *  @route /api/auth/change-password
 *  @method POST
 *  @access public 
 */

    static changePassword = catchAsyncError(async function (req , res , next) {

        const redirectLink  = req.header('redirectLink')
        const codeNum = generateCode()

        const body = _.pick(req.body,['email', 'password'])

        let user = await userModel.findOne({ email : body.email })

        if(!user) return next(new AppError("email does not exist", 400))
        if(user.blocked) return next(new AppError("user blocked",403))

        if(req.user.id != user._id) return next(new AppError("you are not allowed", 403))

        const matchPassword = await bcrypt.compare(body.password, user.password)
        if(!matchPassword) return next(new AppError("Invalid Password", 400))

        const token = jwt.sign({ id: user._id, email: user.email } ,process.env.JWT_SECRET_KEY+ user.password ,{ expiresIn : '10m'})            
        const link = {
         id:user._id,
         token : token
        }

        user.codePass = codeNum
        await user.save()

        sendEmail({ email :user.email , redirectLink, codeNum ,subject: "Change Password"})
        return res.status(200).json({message : 'The code has been sent to your email, please check your email' , link})

    })


    /**
 *  @description Set New Password User
 *  @route /api/auth/set-new-password:id/:token
 *  @method Put
 *  @access public 
 */

    static setNewPassword = catchAsyncError(async function (req , res , next) {
        
        const userId =req.params.id
        const user = await userModel.findById(userId)
        
        if(!user) return next(new AppError("email is not existing", 404))
        if(user.blocked) return next(new AppError("user blocked",403))

        const body = _.pick(req.body,['password' ,'code'])

        if(req.user.id != user._id) return next(new AppError("you are not allowed", 403))

        const token = jwt.verify(req.params.token , process.env.JWT_SECRET_KEY+ user.password ) 
            
        if(user.codePass != body.code) return next(new AppError("code is incorrect", 400))

        user.password = await bcrypt.hash(body.password , Number(process.env.SALT))
        user.codePass =undefined
        await user.save()

        return res.status(200).json({message : ' Password changed successfully '}) 

    })

    /**
   *  @description Confirm user email
   *  @route /api/auth/confirm/:token
   *  @method GET
   *  @access public 
*/
static confirmEmail = catchAsyncError(async (req, res)=>{
   const email = req.email
   await userModel.findOneAndUpdate({email}, {isConfirm:true})
   res.status(200).json({message:'success'})
 })


}


module.exports = AuthController