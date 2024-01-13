const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , 'user name is required'],
      trim: true,
      lowercase: true,
      minlength: [2 , 'too short user name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: 'Email should be XXX@XX.XX'
        }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: v =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v),
        message: 'Password must be at least 8 characters and contain at least one digit, one lowercase, and one uppercase letter.'
      }
    },

    imageProfile: {
      type: String,
      required: true,
    },
    isConfirm :{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 2,
    },
    codePass:{
      type: String,
    },
    isDeleted :{
      type: Boolean,
      default: false
    },
    OTP:{
      type: String,
    },
    loginFailedNo:{
      type: Number,
      default: 0
    },
    blocked:{
      type: Boolean,
      default: false
    }
    
  },{ timestamps: true }
  );


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
