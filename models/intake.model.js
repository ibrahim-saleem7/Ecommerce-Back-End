const mongoose = require("mongoose");

const intakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'intake Required'],
      lowercase: true,
      trim: true,
      minlength: [2, 'intake must be at least 2 characters long'],
      maxlength: [20, 'intake must be at most 20 characters long'],

    },
    slug: {
      type: String,
      lowercase: true,
    },
    slot: {
      type: mongoose.Types.ObjectId,
      ref : 'slot',
      required: [true,'slot Required'],
    },
    programList:[
      {
          program: {type :mongoose.Types.ObjectId ,ref:'program',required:[true,'program Is Required'], trim: true},
          programRate:[
            {
              studentId :{type : String,required:true , trim:true,lowercase:true},
              studentName :{type : String,required:true , trim:true,lowercase:true},
              studentRate :{type : Number,  min:0 ,max :5 },
            }
          ],
          updateBy:{ type: String, lowercase:true , trim:true}    
      }
    ],
    studentsList: [
      {
        type :mongoose.Types.ObjectId , 
        ref : 'student',
        required:[true,'Student Is Required'], 
        trim: true,
      }
    ],
    instructorsList: [
      {
          moduleInstructor: {type :mongoose.Types.ObjectId , ref : 'instructor',required:[true,'instructor Is Required'], trim: true},
          moduleName: {type: String,required:true,trim:true,lowercase:true},
          moduleCorrector: {type :mongoose.Types.ObjectId , ref : 'instructor',required:[true,'instructor Is Required'], trim: true},
          instructorRate: [
            {
              studentId :{type : String , trim:true,lowercase:true},
              studentName :{type : String, trim:true,lowercase:true},
              studentRate :{type : Number,  min:0 ,max :5 },
            }
          ],
          assignBy:{ type: String, lowercase:true , trim:true},
          assignAt:{ type: Date},
          updateBy:{ type: String, lowercase:true , trim:true},
          updateAt:{ type: Date},
      }
    ],
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

const intakeModel = mongoose.model("intake", intakeSchema);

module.exports = intakeModel;
