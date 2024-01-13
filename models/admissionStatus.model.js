const mongoose = require("mongoose");

const admissionStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , 'admission Status name is required'],
      trim: true,
      minlength: [2 , 'too short admission Status name'],
      maxlength: [255 , 'too long admission Status name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    value :{
        type : String,
        required: [true , 'value in  admission Status is required'],
        lowercase: true,
        trim: true,
    },
    createdBy: {type: String, required: true, trim: true},

  },
  { timestamps: true }
);


const admissionStatusModel = mongoose.model("admissionStatus", admissionStatusSchema);

module.exports = admissionStatusModel;
