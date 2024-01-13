
const _ = require('lodash');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const loginFailedModel = require('../models/loginFailed.model');
const userModel = require('../models/user.model');








class LoginFailedController{






/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static getAllLoginFailed = catchAsyncError(async function(req, res, next) {


        let loginFunction = await loginFailedModel.find({})
        .populate('user' ,'name blocked loginFailedNo')
        return res.status(201).json(loginFunction);


})


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static deleteAllLoginFailed = catchAsyncError(async function(req, res, next) {


            let loginFailed = await loginFailedModel.deleteMany({})
            return res.status(201).json({message:  'All login Failed deleted successfully'});


    })


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static reverify = catchAsyncError(async function(req, res, next) {


        if(!req.params.id) return next(new AppError('user id required'),400);

        let user = await userModel.findById(req.params.id)

        if(!user) return next(new AppError('user not found'),404);
        
        user.blocked = false
        user.OTP = undefined
        user.loginFailedNo = 0
        await user.save()
        
        return res.status(201).json({message : `User ${user.name} reverified successfully`});


    })




    
}




module.exports = LoginFailedController