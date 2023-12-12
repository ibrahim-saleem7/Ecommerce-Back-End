const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , 'SubCategory name is required'],
      trim: true,
      // unique: [true , 'SubCategory must be unique '],
      minlength: [2 , 'too short SubCategory name'],
      maxlength: [32 , 'too long SubCategory name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category :{
        type : mongoose.Types.ObjectId,
        ref : 'category',
        required: [true, 'SubCategory must be belong to Category'],
      }
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/ , function(next){
  this.populate('category', 'name')
  next()
})

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
