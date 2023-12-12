const _ = require('lodash');
const slugify = require('slugify');
const orderModel = require('../models/order.model');
const AppError = require('../utils/appError');
const catchAsyncError = require('../middlewares/catchError');
const factory = require('../utils/handlersFactory');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');







class OrderController{


/**
 *  @description Add New Order
 *  @route /api/v1/order
 *  @method POST
 *  @access private (only admin )  
 */

    static addOrder = catchAsyncError(async function(req, res, next) {

            let body = req.body 
            const user = await userModel.findById(body.userDetails.userId)
            .select('confirm')

            if(!user) return next(new AppError('User not found' , 404))
            if(user.confirm) return next(new AppError('Please confirm your account before adding a new order'))

            let product = await productModel.findById(body.productDetails.productId)
            .populate('brand' , 'name -_id')

            if(!product) return next(new AppError('Product not found ' , 404))
            if(product.quantity < body.orderQuantity) return next(new AppError('Sorry, the order quantity is out of the quantity limit for this Product'))

            let tax = 6
            let total = Number(body.orderQuantity * body.price)
            body.totalPrice =  Number(150 + total + (tax * total) / 100 )
            body.taxPrice =  (tax * total) / 100 
            product.quantity = Number(product.quantity - body.orderQuantity)
            product.sold =Number(product.sold + body.orderQuantity)

           
            await product.save()
            await orderModel.create(body)
            return res.status(201).json({message : 'Order Successful' , order:product.title, quantity:body.orderQuantity});


    })


/**
 *  @description  Confirmation Order
 *  @route /api/v1/order/confirmation/:id
 *  @method PUT
 *  @access private (only admin )  
 */

    static actionOrder  = catchAsyncError(async function(req, res, next) {

            let status = req.body.status; 
            let order = await orderModel.findById(req.params.id)
            order.status =  status  

            await order.save()
            return res.status(201).json({message : 'Action Order Successful' });


    })

/**
 *  @description  Cancel Order
 *  @route /api/v1/order/cancel/:id
 *  @method PUT
 *  @access private (only admin )  
 */

    static cancelOrder  = catchAsyncError(async function(req, res, next) {

            let order = await orderModel.findById(req.params.id);

            if(!order) return next(new AppError('Order not found' , 404))
            if(order.status === 'delivered') return next(new AppError('Order already delivered' ,400))
            if(order.status === 'charged') return next(new AppError('Order already charged' ,400))

            let product = await productModel.findById(order.product)
            
            product.quantity = Number(product.quantity + order.orderQuantity)
            product.sold =Number(product.sold - order.orderQuantity)
            order.status = 'canceled'
            order.cancelationDate = new Date()
            order.dateOfArrival = undefined

            await order.save()
            await product.save()
            return res.status(201).json({message : 'Cancel Order Successful' });


    })


/**
 *  @description Get All Order 
 *  @route /api/order
 *  @method GET
 *  @access public
 */

    static  getAllOrders = catchAsyncError(async function(req, res, next) {

            // Pagination 
            let {pageSize, pageNumber,sort , keyword ,status } = req.query
            let totalPages
            let orders
            let countDocuments
            const search = {}
            
            // Pagination 
            pageSize = Number(req.query.pageSize) ||  20
            pageNumber = Number(req.query.pageNumber) || 1
            
            // Sorting
            sort = sort || '-createdAt'
            sort = sort?.replaceAll(',', ' ')
                    
            // Search Keywords
            keyword = keyword?.trim() || ''
            search.$or = [
                {'userDetails.userName': {$regex: keyword, $options: 'i'}},
                {'userDetails.userPhone': {$regex: keyword, $options: 'i'}},
                {'productDetails.productTitle': {$regex: keyword, $options: 'i'}},
                {'shippingAddress.city': {$regex: keyword, $options: 'i'}},
            ]

            countDocuments = await orderModel.countDocuments()

            orders = await  orderModel.find({status : status})
            .skip((pageNumber -1 ) * pageSize)
            .limit(pageSize)
            .sort(sort)
            .find(search)
            

            if(orders.length < pageSize ){
                totalPages  = orders.length>pageSize? Math.ceil(orders.length/pageSize) : 1
            }else{
                totalPages  = countDocuments>pageSize? Math.ceil(countDocuments/pageSize) : 1
            }


            return res.status(200).json(
                {
                    totalPages,
                    requestResults: orders.length,
                    pageNumber,
                    pageSize,
                    orders

                })
        

    })




/**
 *  @description Get Order By Id
 *  @route /api/order/:id
 *  @method GET
 *  @access public   
 */
    static  getOrderById = factory.getDocumentById(orderModel)
    
/**
 *  @description Update Order
 *  @route /api/order/:id
 *  @method PUT
 *  @access private (only admin )  
 */
    static  updateOrder = factory.updateDocument(orderModel)

/**
 *  @description Delete Order By Id
 *  @route /api/order/:id
 *  @method DELETE
 *  @access private   
 */
    static  deleteOrderById = factory.deleteDocument(orderModel)
    
}




module.exports = OrderController