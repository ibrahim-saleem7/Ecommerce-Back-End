// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
// const _ = require('lodash');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const sendEmail = require('../emails/sendEmail');
// const General = require('../utils/general')

// const User = require('../models/product.model')
// const generateToken = require('../utils/generateToken')
// const formatConfirm = require('../emails/formatConfirm')
// const formatResetPassword = require('../emails/formatResetPassword')


// class AuthController{



// /**
//  *  @description Register New User
//  *  @route /api/auth/register
//  *  @method POST
//  *  @access public 
//  */

//     static async register(req , res){

//         try {

//             const body = _.pick(req.body , ['email' ,'userName' ,'password'])
//             const user = await User.findOne({ email : body.email})

//             if(user) return res.status(401).json({ message : "User already exists" })
            
//             await General.hashPassword(body)

//             let newUser = new User(body)
//             const result = await newUser.save()

//             const secret = process.env.JWT_SECRET_KEY + newUser.isConfirm 
//             const token = jwt.sign({ email : result.email , id : result._id , isConfirm : result.isConfirm} ,secret )

//             const link = `http://localhost:${process.env.PORT}/api/auth/confirmAccount/${result._id}/${token}`

//             const options = {
//                 to: result.email,
//                 subject: "Confirm Account",
//                 html:formatConfirm(link)
//             }

//             sendEmail(options)
//             return res.status(201).json({email : result.email, message : 'registration successful , please confirm your account '})
//         }

//         catch (error) {
//             res.status(500).json({message : error.message})
//         }
        

//     }



// /**
//  *  @description Confirm Account For New User
//  *  @route /api/auth/confirmAccount/:userId/:token
//  *  @method GET
//  *  @access public 
//  */

//     static async confirmAccount(req , res){

//         try {

//             const userId = req.params.id
//             const user = await User.findById(userId)

//             if(!user) return res.status(401).json({ message : 'email is not existing' })


//             const secret = process.env.JWT_SECRET_KEY + user.isConfirm 
//             jwt.verify(req.params.token, secret) 

//             user.isConfirm = true ;
//             await user.save()

//             return res.status(201).json({ email : user.email, message : "Account Confirmed"  }) 
//         }

//         catch (error) {
//             res.status(500).json({message : error.message})
//         }
        

//     }



// /**
//  *  @description Login The User
//  *  @route /api/auth/login
//  *  @method POST
//  *  @access public 
//  */

//     static async login(req , res){


//         try {

//             const body = _.pick(req.body , ['email' , 'password'])
//             const user = await User.findOne({ email : body.email })

//             if(!user){
//                 return res.status(401).json({ message : 'Invalid email or password' })
//             }

//             if(!user.isConfirm) return res.status(403).json({ message : 'please confirm your account' })  

//             const matchPassword = await bcrypt.compare(body.password, user.password)
//             if(!matchPassword){
//                 return res.status(401).json({ message : 'Invalid email or password' })
//             }

//             const { password , ...other} = user._doc
//             const token = generateToken({id : user._id , isAdmin : user.isAdmin})

//             return res.status(200).json({...other , token })
//         }

//         catch (error) {
//             res.status(500).json({message : error.message})
//         }





        
//     }



// /**
//  *  @description Forgot Password User
//  *  @route /api/auth/forgot-password
//  *  @method POST
//  *  @access public 
//  */

//     static async forgotPassword(req , res){

//         try {

//             const email = req.body.email
//             const user = await User.findOne({ email : email })

//             if(!user){
//                 return res.status(401).json({ message : 'email is not existing' })
//             }

//             const secret = await General.secretKey(user)

//             const code =Math.floor(Math.random() * 100_000_000).toString(16);
//             const token = jwt.sign({id: user._id, email: user.email , code} ,secret ,{ expiresIn : '10m'})
            
//             const link = `http://localhost:${process.env.PORT}/api/auth/reset-password/${user._id}/${token}`
//             // after validating the password and the email,
//             // you will be redirected to the reset password page,
//             // and inserted code sent in your email and add the new password.
            
//             const options = {
//                 to: user.email,
//                 subject: "Reset Password",
//                 html: formatResetPassword(code ,"Reset")
//             }

            
//             sendEmail(options)

//             return res.status(201).json({message : 'The code has been sent to your email, please check your email ' , link} )
//             // link here to redirect to the reset password page only
//             // in front end not send link in response but redirect to the reset password page
//         }

//         catch (error) {
//             return res.status(500).json({message : error.message})
//         }
//     }



// /**
//  *  @description Reset Password The User
//  *  @route /api/auth/reset-password/:userId/:token
//  *  @method POST
//  *  @access public 
//  */

//     static async resetPassword(req , res){


//         try {

//             const user = await User.findById(req.params.id)

//             if(!user) return res.status(401).json({ message : 'email is not existing' })

//             const body = _.pick(req.body , ['password' , 'code'])
//             const secret = await General.secretKey(user)

//             const toke = jwt.verify(req.params.token, secret) 

//             if(toke.code != body.code) return res.status(403).json({ message : 'code is incorrect' })

//             user.password = await General.hashPassword(body)
//             await user.save()

//             return res.status(201).json({ email : user.email , message : 'The password is reset successfully'})
//         }

//         catch (error) {
//             return res.status(500).json({message : error.message})
//         }
        
//     }



// /**
//  *  @description Change Password The User
//  *  @route /api/auth/change-password
//  *  @method POST
//  *  @access public 
//  */

//     static async changePassword(req , res){


//         try {

//             const body = _.pick(req.body,[  'email','password' ])
//             const user = await User.findOne({ email: body.email})

//             if(!user) return res.status(401).json({ message : 'Invalid email or password' })

//             if(req.user.id != user._id) return res.status(403).json({ message : 'you are not allowed'})
//             if(!user.isConfirm) return res.status(403).json({ message : 'please confirm your account' })  

//             const matchPassword = await bcrypt.compare(body.password, user.password)
//             if(!matchPassword) return res.status(401).json({ message : 'Invalid email or password' })

//             const secret = await General.secretKey(user)
//             const code = await General.code() // 556622
            
//             const token = jwt.sign({id: user._id, email: user.email, isAdmin: user.isAdmin , code}, secret ,{expiresIn : '10m'})
            
//             const link = `http://localhost:${process.env.PORT}/api/auth/set-new-password/${user._id}/${token}`
//              // after validating the password and the email,
//              // you will be redirected to the new password page,
//              // and inserted code sent in your email and new password.
            
//             const options = {
//                 to: user.email,
//                 subject: "Change Password",
//                 html: formatResetPassword(code , "Change")
                    
//             }

            
//             sendEmail(options)
//             return res.status(201).json({message : 'The code has been sent to your email, please check your email ' , link} )
//             // link here to redirect to the new password page only
//             // in front end not send link in response but redirect to the new password page
//         }
//         catch (error) {
//             res.status(500).json({message : error.message})
//         }





        
//     }



// /**
//  *  @description Set New Password The User
//  *  @route /api/auth/set-new-password/:userId/:token
//  *  @method PUT
//  *  @access public 
//  */

//     static async setNewPassword(req , res){


//         try {

//             const userId =req.params.id
//             const user = await User.findById(userId)
            
//             if(!user) return res.status(401).json({ message : 'email is not existing' })

//             const body = _.pick(req.body,['password' ,'code'])
//             const secret = await General.secretKey(user)
//             const token = jwt.verify(req.params.token, secret) 
            
//             if(token.code != body.code) return res.status(403).json({ message: 'code is incorrect'})

//             user.password = await General.hashPassword(body)
//             await user.save()

//             return res.status(201).json({ email : user.email , message : 'The password is changed successfully'} )

//         }
//         catch (error) {
//             res.status(500).json({message : error.message})
//         }
        
//     }



//     /**
//  *  @description Change Email The User
//  *  @route /api/auth/change-email
//  *  @method POST
//  *  @access private () 
//  */

//     // static async changeEmail(req , res){


//     //     try {

//     //         const body = _.pick(req.body,[  'email','password' ])
//     //         const user = await User.findOne({ email: body.email})

//     //         if(!user) return res.status(401).json({ message : 'Invalid email or password' })


//     //         // if(req.user.id != user._id) return res.status(403).json({ message : 'you are not allowed'})
//     //         if(!user.isConfirm) return res.status(403).json({ message : 'please confirm your account' })  

//     //         const matchPassword = await bcrypt.compare(body.password, user.password)
//     //         if(!matchPassword) return res.status(401).json({ message : 'Invalid email or password' })

//     //         const secret = process.env.JWT_SECRET_KEY + user.email
//     //         const code =Math.floor(Math.random() * 100_000_000).toString(16);
            
//     //         const token = jwt.sign({id: user._id, email: user.email, isAdmin: user.isAdmin , code}, secret ,{expiresIn : '10m'})
//     //         const link = `http://localhost:${process.env.PORT}/api/auth/set-new-email/${user._id}/${token}`
//     //          // after validating the password and the email,
//     //          // you will be redirected to the add new email page,
//     //          // and inserted the code sent in your email and new email.
            
//     //         const options = {
//     //             to: user.email,
//     //             subject: "Change Email",
//     //             html: 
//     //                 `<div>
//     //                     <h4> Change Email Account : ${user.email}</h4>
//     //                     <p> Code :  <b>${code}</b> </p>
                        
//     //                 </div>`,
//     //         }

            
//     //         sendEmail(options)
//     //         return res.status(201).json({message : 'The code has been sent to your email, please check your email ' , link} )
//     //         // link here to redirect to the add new password page only
//     //         // in front end not send link in response but redirect to the add new password page
//     //     }
//     //     catch (error) {
//     //         res.status(500).json({message : error.message})
//     //     }





        
//     // }


//     // static async setNewEmail(req , res){


//     //     try {

//     //         const userId =req.params.id
//     //         const user = await User.findById(userId)
            
//     //         if(!user) return res.status(401).json({ message : 'email is not existing' })

//     //         const body = _.pick(req.body,['email' ,'code'])
//     //         const secret = process.env.JWT_SECRET_KEY + user.email
//     //         const token = jwt.verify(req.params.token, secret) 
            
//     //         if(token.code != body.code) return res.status(403).json({ message: 'code is incorrect'})

//     //         user.email = body.email
//     //         user.isConfirm = false
//     //         await user.save()

            
//     //         const confirmSecret = process.env.JWT_SECRET_KEY + newUser.isConfirm 
//     //         const confirmToken = jwt.sign({ email : result.email , id : result._id , isConfirm : result.isConfirm} ,secret )

//     //         const {password ,_id, ...other} = result._doc
//     //         const link = `http://localhost:${process.env.PORT}/api/auth/confirmAccount/${result._id}/${token}`

//     //         const options = {
//     //             to: result.email,
//     //             subject: "Confirm Account",
//     //             html: 
//     //                 `<div>
//     //                     <h4> Confirm Account : ${result.email}</h4>
//     //                     <h5> Click on the link : </h5>
//     //                     ${link}
//     //                 </div>`,
//     //         }

            
//     //         sendEmail(options)









            

//     //         return res.status(201).json({ email : user.email , message : 'The password is changed successfully'} )

//     //     }
//     //     catch (error) {
//     //         res.status(500).json({message : error.message})
//     //     }
        
//     // }
// }




// module.exports = AuthController