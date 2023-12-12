const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    feedback: {
      type: String,
    },
    user:{
        type : mongoose.Types.ObjectId,
        ref : 'user'
    },
    product:{
        type : mongoose.Types.ObjectId,
        ref : 'product',
    }
  },
  { timestamps: true }
);




const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;
