
const _ = require('lodash');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const trashModel = require('../models/trash.model');






class TrashController{


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static getAllTrash = catchAsyncError(async function(req, res, next) {


            let trash = await trashModel.find({})
            return res.status(201).json(trash);


    })


/**
 *  @description Add New User
 *  @route /api/v1/user
 *  @method POST
 *  @access public  
 */

    static deleteAllTrash = catchAsyncError(async function(req, res, next) {


            let trash = await trashModel.deleteMany({})
            return res.status(201).json({message:  'All Trash deleted successfully'});


    })




    
}




module.exports = TrashController