const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , 'specialization name is required'],
      trim: true,
      minlength: [2 , 'too short specialization name'],
      maxlength: [255 , 'too long specialization name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    days :{
        type : Array,
        required: [true , 'days in  slot is required'],
        lowercase: true,
        trim: true,
    },
    createdBy: {type: String, required: true, trim: true},
    updatedBy: {type: String,  trim: true},
    isActive:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);


const slotModel = mongoose.model("slot", slotSchema);

module.exports = slotModel;
