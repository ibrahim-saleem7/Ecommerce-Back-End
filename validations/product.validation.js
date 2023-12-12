const joi = require('joi');



class Product {

    static addProduct = joi.object({
        title : joi.string().required().trim().min(3).max(100),
        price : joi.number().required(),
        description : joi.string().required().trim().min(20),
        quantity : joi.number().required(),
        category : joi.string().required(),
        subCategory : joi.string().required(),
        brand : joi.string().required(),
        colors : joi.array().items(joi.string()),
        priceAfterDiscount : joi.number(),
        slug : joi.string(),
        imageCover : joi.string(),
        images : joi.any(),
    })

    static updateProduct = joi.object({
        title : joi.string().trim().min(3).max(100),
        price : joi.number().min(20),
        description : joi.string().trim().min(20),
        quantity : joi.number(),
        category : joi.string(),
        subCategory : joi.string(),
        brand : joi.string(),
        colors : joi.array().items(joi.string()),
        priceAfterDiscount : joi.number(),
        slug : joi.string(),
        imageCover : joi.string(),
        images : joi.any(),
    })

}
    




module.exports = Product