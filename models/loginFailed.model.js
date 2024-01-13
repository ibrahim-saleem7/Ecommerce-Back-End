const mongoose = require("mongoose");

const loginFailedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref :'user',
      required: true ,
      trim: true,
    },
    
  },
  { timestamps: true }
);


const loginFailedModel = mongoose.model("loginFailed", loginFailedSchema);

module.exports = loginFailedModel;
