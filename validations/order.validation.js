const joi = require('joi');



class Order {

    static addOrder = joi.object({
        userDetails : joi.object({
            userId:joi.string().required().trim(),
            userName : joi.string().required().trim(),
            userPhone : joi.string().required().trim().pattern(/^01[0125][0-9]{8}$/),
        }),
        productDetails : joi.object({
            productId: joi.string().required().trim(),
            productTitle: joi.string().required().trim(),
            productBrand: joi.string().required().trim(),
            productSize: joi.string().required().trim(),
            productColor: joi.string().required().trim(),

        }),
        shippingAddress: joi.object({
            city : joi.string().trim().required(),
            details : joi.string().trim().required(),
            postalCode : joi.string().trim(),
        }),
        orderQuantity : joi.number().required().min(1),
        price : joi.number().required()
    })

    static actionOrder = joi.object({
        status : joi.string().trim().min(2).max(20).required().valid('pending', 'order placed' , 'charged' , 'delivered' , 'canceled'),
        
    })


}
    




module.exports = Order