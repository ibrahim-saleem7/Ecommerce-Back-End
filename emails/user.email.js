const nodemailer = require('nodemailer') 
const emailConfirmFormat = require("./email.confirm.js")
const passwordResetForgetFormat = require("./email.password.js")
const generateToken = require('../utils/generateToken.js') 
const AppError = require('../utils/appError.js')

/**
   *  @description Sends emails to users when confirm email or reset password
   *  @param {string} email - user email.
   *  @param {string} redirectLink - Frontend route to redirect user (in confirm case).
   *  @param {number} code - Code to verify (in resst password case).
   *  @param {string} subject - Email subject.
   * @returns {string} html email string
*/

const sendEmail = async({email, redirectLink, codeNum, subject})=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })
    
    const info = await transporter.sendMail({
        from: `BMD <${process.env.EMAIL}>`,
        to: email,
        subject: subject || "BMD Email",
        html: (function (){
            if(codeNum) {
               return passwordResetForgetFormat(codeNum)
            }
            else {
                const token = generateToken({email})
               return emailConfirmFormat(token, redirectLink)
            }
        })()
    }, (error , success)=>{
        if (error){
            return new AppError(error.message, 400)
        }
        return {message : 'Email sent successfully!' };
    })
}
module.exports = sendEmail