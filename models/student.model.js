const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
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
    BDName: {
      type: mongoose.Types.ObjectId,
      ref: 'sales',
      required: [true,'BD Name is Required'],
    },
    OrgName: {
      type: mongoose.Types.ObjectId,
      ref: 'company',
      required: [true,'company Name is Required'],      
    },
    phoneNumber : {
        type: String,
        required: [true,'phone Number is Required'],
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
        validate: {
          validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
          message: 'Email should be XXX@XX.XX'
        }
      },
    institute: {
      type: String,
      lowercase: true,
      trim: true,
      default : 'CSB'
    },
    number: {
      type: String,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default:'UK'
    },
    slug: {
      type: String,
      lowercase: true,
    },
    registrationNumber: {
      type: String,
      required: [true,'Registration Number is Required'],
      unique: [true,'Registration Number must be Unique'],
      // default : institute+'-'+programAbbreviation+'-'+firstName+'-'+lastName+'-'+number+country
    },
    specialization : [
      {
        type: mongoose.Types.ObjectId,
        ref: "specialization",
        required: [true,'specialization Required'],
        trim: true,
      },
    ],
    studentModules: [
      {
              moduleName :{type: String,lowercase:true, trim: true, required: true},
              moduleInstructor :{type: String,lowercase:true, trim: true},
              moduleRate:{type: Number,min : 0,max : 5},
              instructorRate:{type: Number,min : 0,max : 5},
              calloutsRate:{type: Number,min : 0,max : 5,},
              moduleAssignment:{
                assignmentStatus: {type: String,lowercase:true, trim: true , default: 'not received'},
                assignmentScore: {type: Number, min : [0,'assignment Score minimum 0'], max : [100,'assignment Score maximum 100']},
                assignmentDeadline: {type: Date},
                assignmentDate: {type: Date},
              },
              attendee:[
                {
                  status: {type: String,lowercase:true,enum:['attended' , 'absence'], trim: true},
                  date: {type: Date},
                  attendeeBy: {type: String,lowercase:true , trim: true},
                }
              ],
              assignBy:{ type: String, lowercase:true , trim:true},
              assignAt:{ type: Date},
              updateBy:{ type: String, lowercase:true , trim:true},
              updateAt:{ type: Date},

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
    programEnrolled : [
      {
          program:{type: mongoose.Types.ObjectId,ref: "program",required: [true,'Program Enrolled Required'],},
          assignBy:{ type: String, lowercase:true , trim:true},
          assignAt:{ type: Date},
          updateBy:{ type: String, lowercase:true , trim:true},
          updateAt:{ type: Date},
      }
    ],
    studentFinancial:{
      paymentMethod:{
        type: String,
        required: true
      },
      reservation:{
        type: Number,
        required: true
      },
      paid:{
        type: Number,
        required: true
      },
      numberOfInstallments:{
        type: Number,
        required: true
      },
      totalBill:{
        type: Number,
        required: true
      },
      installments: [
        {   
              installmentNumber: {type : Number },
              installmentValue: {type : Number  },
              installmentDate: {type : String, },
              installmentStatus: {type : String, trim:true, lowercase:true , default: 'not paid'},
              installmentCountry: {type : String, trim : true ,lowercase:true},
                
        },
      ],
          assignBy:{ type: String, lowercase:true , trim:true},
          assignAt:{ type: Date},
          updateBy:{ type: String, lowercase:true , trim:true},
          updateAt:{ type: Date},
    },
    
    status:{
      type: String,
      lowercase : true,
      required : true,
      default: 'active',
    },
    // status:{
    //   type: mongoose.Types.ObjectId,
    //   ref : 'admissionStatus',
    //   required : true,
    // },
    comment:{
      type: String,
      trim: true,
    },
    isActive:{
      type: Boolean,
      default: true,
    },
    createdBy: {type: String, required: true, trim: true},
    updatedBy:  {type: String,  trim: true},
    
  },
  { timestamps: true }
);

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
