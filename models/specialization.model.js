const mongoose = require("mongoose");

const specializationSchema = new mongoose.Schema(
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
    modules :{
        type : Array,
        required: [true , 'Modules in  specialization is required'],
        lowercase: true,
        trim: true,
      },
    createdBy: {
      type: String,
        trim: true
    },
    instructorsList:[
      {
        type: mongoose.Types.ObjectId,
        ref: 'instructor',
      }
    ],
    studentsList:[
      {
        type: mongoose.Types.ObjectId,
        ref: 'student',
      }
    ],
    updatedBy:{
      type: String,
        trim: true
    },
    isActive:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);


const specializationModel = mongoose.model("specialization", specializationSchema);

module.exports = specializationModel;
