const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength:[3 , 'too short product title'],
      maxLength:[100, 'too long product title'],
      trim: true,
    },
    slug:{
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type : String,
      minLength :[20 , 'too short product description'],
      required: true,
    },
    quantity:{
      type : Number,
      required: true,
    },
    sold:{
      type : Number,
      default: 0,
    },
    price:{
      type : Number,
      required: true,
      trim: true,
      // max:[20 , 'too long product price']
    },
    priceAfterDiscount:{
      type : Number,
    },
    colors :{
      type : [String],
    
    },
    imageCover :{
      type : String,
      required : true,
    },
    images :{
      type : [String],
      required : true, 
    },
    category:{
      type : mongoose.Types.ObjectId,
      ref : 'category',
      required: true,
    },
    subCategory :{
      type : mongoose.Types.ObjectId,
      ref : 'subCategory',
      required: true,
    },
    brand :{
      type : mongoose.Types.ObjectId,
      ref : 'brand',
      required: true,
    },
    
    ratingAverage:{
      type : Number,
      min : [1 , 'rating must be above or equal 1.0'],
      max : [5, 'rating must be below or equal 5.0'],
    },
    ratingsQuality:{
      type : Number,
      default : 0
    }
  
  },
  { timestamps: true }
);

productSchema.pre(/^find/ , function(next){
  this.populate('category subCategory brand','name')
  next()
})

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
