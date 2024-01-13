const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required: [true,'Company Name is required'],
            trim: true,
            lowercase: true,
            minlength : [2 , 'Minimum 2 characters is required for company name'], 
        },
        slug: {
            type: String,
            lowercase: true,
          },

        address : {
            type: String ,
            required: true,
            lowercase: true,
            trim: true,
        },
        phoneNumbers : {
            type: [String] ,
            required: true,
        },
        email : {
            type: String,
            trim: true,
            lowercase: true,
            required: [true,'Email is Required'],
            validate: {
            validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: 'Email should be XXX@XX.XX'
            }
        },
        companyField: {
            type:String,
            minLength: [2 , 'minLength 2 characters required for company field'], 
            lowercase : true ,
            trim : true,
            required: true
        },
        numberOfEmployees: {
            type:Number,
            min: 1,
            required: true
        },
        BDName: {
            type:mongoose.Types.ObjectId,
            ref : 'sales', 
            required: [true,'BDName is Required'],
        },
        programs:[
            {
                program : {type:mongoose.Types.ObjectId , ref: 'program' ,required: true},
                price : {type: Number,required: true, min:0},
            }
        ],
        students:[
            {
                type:mongoose.Types.ObjectId,
                ref: "student" 
            }
        ],
        representativeOfCompany: [
            {
                name:{type : String,
                    required: [true,'representative Of Company Name is required'],
                    trim: true,
                    minlength : [3 , 'Minimum 3 characters is required for representative name'], 
                },
                position:{type : String, required: [true,'position is required'] , trim: true, lowercase: true, uppercase: true},
                phoneNumber:{type : String,required: true , trim: true , lowercase: true},
                email:{
                    type: String,
                    trim: true,
                    lowercase: true,
                    required: [true,'Email is Required'],
                    validate: {
                    validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
                    message: 'Email should be XXX@XX.XX'
                    }
                },
            }
        ],
        status: {
            type: String, 
            default: 'active',
            required: true,
            lowercase: true,
            trim: true
        },
        comment:{
            type: String, 
        },
        createdBy:{
            type: String,
            trim:true,
            lowercase: true,
            required: true,
        },
        updatedBy:{
            type: String,
            trim:true,
            lowercase: true,

        },
        isActive: {
            type: Boolean, 
            default: true,
        }

    },
    { timestamps: true }
);



const companyModel = mongoose.model("company", companySchema);

module.exports = companyModel;
