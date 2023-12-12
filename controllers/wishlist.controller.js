const _ = require('lodash');
const slugify = require('slugify');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const productModel = require('../models/product.model');
const userModel = require('../models/user.model');






class WishlistController{


/**
 *  @description Add New Wishlist
 *  @route /api/v1/wishlist
 *  @method POST
 *  @access private (user)
 */

    static addWishlist = catchAsyncError(async function(req, res, next) {


            const body = req.body 
            
            const user = await userModel.findById(body.userId)

            if(user.wishlist.includes(body.productId)) return next(new AppError('Product already in your wishlist', 409))
            
            user.wishlist.push(body.productId)
            await user.save()
            
            return res.status(201).json({message: 'Product added to your wishlist successfully'});


    })



/**
 *  @description Delete Wishlist By Id
 *  @route /api/wishlist
 *  @method DELETE
 *  @access private  (user)
 */
    static  deleteWishlistById = catchAsyncError(async function(req, res, next) {

        const body = req.body;

        let user = await userModel.findById(bode.userId)

        let indexWishes = user.wishlist.indexOf(body.productId)

        user.wishlist.splice(indexWishes, 1)
        await user.save()
              
        return res.status(201).json({message: 'Item Deleted in Wishlist Successfully'})
    })
    
}




module.exports = WishlistController