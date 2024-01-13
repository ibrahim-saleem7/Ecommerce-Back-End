const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'program Required'],
      trim: true,
      lowercase: true,
      minlength: [2, 'program must be at least 2 characters long'],
      maxlength: [255, 'program must be at most 255 characters long'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    // price:{
    //   type :Number,
    //   required: [true,'program price is required'],
    // },
    programAbbreviation:{
      type: String,
      required: true,
      trim:true,
    },
    specialization:{
        type: mongoose.Types.ObjectId,
        ref: "specialization",
        required: true,
    },
    intakeList:[
      {
        type: mongoose.Types.ObjectId,
        ref: "intake",
        trim: true,
      }
    ],
    studentList:[
      {
        type: mongoose.Types.ObjectId,
        ref: "student",
        trim: true,
      }
    ],
    createdBy: {type: String, trim: true, required: true},
    updatedBy:  {type: String,  trim: true},
    isActive:{
      type: Boolean,
      default: true,
    }

  },
  { timestamps: true }
);

const programModel = mongoose.model("program", programSchema);

module.exports = programModel;
