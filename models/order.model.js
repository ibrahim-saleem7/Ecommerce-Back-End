const mongoose = require("mongoose");
let dateOfArrival = new Date();
dateOfArrival = dateOfArrival.setDate(dateOfArrival.getDate()+3);

const orderSchema = new mongoose.Schema(
    {
        userDetails : {
            userId :{type: String , required:true , trim : true}, 
            userName : {type: String , required: true},
            userPhone : {
                type: String ,
                required: true,
                validate: {
                    validator: v => /^01[0125][0-9]{8}$/gm.test(v),
                    message: 'Mobile number is not valid'
                  }
                },
        },
        productDetails : {
            productId: {type : String , required : true , trim : true} ,
            productTitle: {type : String , required : true , trim : true} ,
            productBrand: {type : String , required : true , trim : true} ,
            productSize:  {type : String  , trim : true ,default : 'default'} ,
            productColor: {type : String , trim : true ,default : 'default'} ,
        },
        shippingAddress : {
            city : {type : String, required : true, trim : true},
            details : {type : String, required : true, trim : true},
            postalCode : {type : String, trim : true}
        },
        orderNumber : {
            type : String, 
            required : true , 
            trim : true
        },
        orderQuantity: {
            type:Number, 
            required: true
        },
        price: {
            type:Number, 
            required: true
        },
        totalPrice: {
            type:Number, 
            required: true
        },
        taxPrice:{
            type:Number, 
            default : 0
        },
        shippingExpenses:{
            type:Number, 
            default : 150
        },
        status: {
            type: String, 
            default: 'pending',
            enum: ['pending', 'order placed' , 'charged' , 'delivered' , 'canceled']
        },
        cancelationDate: {
            type: Date,  
        },
        dateOfArrival : {
            type: Date, 
            default: dateOfArrival
        },
    },
    { timestamps: true }
);



const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
