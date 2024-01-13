const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'name Required'],
      lowercase: true,
      trim: true,
      minlength: [2, 'name must be at least 2 characters long'],
      maxlength: [50, 'name must be at most 50 characters long'],

    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email must be unique'],
        lowercase: true,
        validate: {
            validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: 'Email should be XXX@XX.XX'
        }
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone:{
        type: String,
        required: [true, 'phone required'],
        unique: [true, 'phone must be unique'],
        validate: {
            validator: v => /^01[0125][0-9]{8}$/gm.test(v),
            message: 'Mobile number is not valid'
          }
    },
    sellerDealsStudent:[
      {
        deal:{
          type: mongoose.Types.ObjectId,
          ref: 'student',
          required: [true, 'deal required'], 
        },
        dateOfDeal:{type: Date, default: new Date},
      }
    ],
    sellerDealsCompanies:[
      {
        deal:{
          type: mongoose.Types.ObjectId,
          ref: 'company',
          required: [true, 'deal required'], 
        },
        dateOfDeal:{type: Date, default: new Date},
      }
    ],
    createdBy: {type: String, required: true, trim: true},
    updatedBy: {type: String,  trim: true},
    isActive:{
      type: Boolean,
      default: true,
    }
  
  },
  { timestamps: true }
);

const salesModel = mongoose.model("sales", salesSchema);

module.exports = salesModel;
