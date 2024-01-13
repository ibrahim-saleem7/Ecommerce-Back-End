const mongoose = require("mongoose");

const trashSchema = new mongoose.Schema(
  {
    deletedItem: {
      type: String,
      required: [true , 'deleted Item is required'],
      trim: true,
    },
    deletedBy: {
      type: String,
      required: [true , 'deletedBy is required'],
      lowercase: true,
    },
  },
  { timestamps: true }
);


const trashModel = mongoose.model("trash", trashSchema);

module.exports = trashModel;
