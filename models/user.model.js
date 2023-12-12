const { ref } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , 'SubCategory name is required'],
      trim: true,
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
        required: [true, 'password required'],
        minlength: [6, 'Too short password'],
    },
    wishlist: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'product',
        },
    ],
    phone:{
        type: String,
        required: [true, 'phone required'],
        unique: true,
        validate: {
            validator: v => /^01[0125][0-9]{8}$/gm.test(v),
            message: 'Mobile number is not valid'
          }
    },
    imageProfile: String,
    address:{
        city:{type: String, required:true},
        details:{type: String, required:true},
        postalCode:{type: String,},
    },
    confirm :{
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        default: 'user'
    }

  },
  { timestamps: true }
);

userSchema.pre(/^findById/ , function(next){
  this.populate('wishlist')
  next()
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
