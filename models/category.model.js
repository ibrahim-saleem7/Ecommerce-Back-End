const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'Category Required'],
      trim: true,
      unique: [true,'Category must be Unique'],
      minlength: [2, 'Category must be at least 2 characters long'],
      maxlength: [20, 'Category must be at most 20 characters long'],

    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, 'Category image is required'],
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
