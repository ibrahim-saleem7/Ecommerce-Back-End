const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true,'full Name Required'],
      lowercase: true,
      trim: true,
      minlength: [9, 'full Name must be at least 9 characters long'],
      maxlength: [100, 'full Name must be at most 100 characters long'],

    },
    firstName: {
      type: String,
      required: [true,'first Name Required'],
      lowercase: true,
      trim: true,
      minlength: [2, 'first Name must be at least 2 characters long'],
      maxlength: [20, 'first Name must be at most 20 characters long'],

    },
    lastName: {
      type: String,
      required: [true,'last Name Required'],
      lowercase: true,
      trim: true,
      minlength: [2, 'last Name must be at least 2 characters long'],
      maxlength: [20, 'last Name must be at most 20 characters long'],

    },
    phoneNumber : {
      type: String,
      required: [true,'phoneNumber is Required'],
    },
    personalEmail : {
      type: String,
      trim: true,
      lowercase: true,
      required: [true,'Email is Required'],
      validate: {
        validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: 'Email should be XXX@XX.XX'
      }
    },
    businessEmail : {
      type: String,
      trim: true,
      lowercase: true,
      required: false,
      validate: {
        validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: 'Email should be XXX@XX.XX'
      }
    },
    slug: {
      type: String,
      lowercase: true,
    },
    specializationList:[
      {
          type:mongoose.Types.ObjectId ,
          ref :'specialization',
          required:true , 
          trim:true,
      }
    ],
    intakeList: [
      {
        intake :{type: mongoose.Types.ObjectId,ref: "intake",trim: true},
        comment:{type: String,trim: true},
        assignBy:{type: String,trim: true},
        updateBy:{type: String,trim: true},
        assignAt: {type: Date},
        updateAt:{type: Date},
      }
    ],
    contract:{type: String, required: true ,trim: true},
    createdBy: {type: String, required: true, trim: true},
    updatedBy: {type: String,  trim: true},
    status:{
      type: String,
      lowercase : true,
      required : true,
      default: 'active',
    },
    comment:{
      type: String,
      trim: true,
    },
    isActive:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const instructorModel = mongoose.model("instructor", instructorSchema);

module.exports = instructorModel;
