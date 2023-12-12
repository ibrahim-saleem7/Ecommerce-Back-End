const mongoose = require('mongoose');
const dotenv =require('dotenv')
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../', '.env') });

async function connectDB(){

        await mongoose.connect(process.env.DB_URI)
        .then(()=>{
            console.log("connection done")
        })
        .catch((err)=>{
            console.log({message : `connection error ${err.message}`});process.exit(1)
        })


}

module.exports= connectDB