const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'Brand Required'],
      trim: true,
      unique: [true,'Brand must be Unique'],
      minlength: [2, 'Brand must be at least 2 characters long'],
      maxlength: [20, 'Brand must be at most 20 characters long'],

    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true,'Image Required'],
    },
  
  },
  { timestamps: true }
);

const brandModel = mongoose.model("brand", brandSchema);

module.exports = brandModel;
