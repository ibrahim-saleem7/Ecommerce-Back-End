const joi = require('joi');


class Auth {

    static login = joi.object({
        email: joi.string().lowercase().required().email(),
        password: joi.string().required(),
    })

    static checkUser = joi.object({
        id: joi.string().lowercase().required(),
    })

    static otp = joi.object({
        code: joi.string().required(),
    })

    static email = joi.object({
        email: joi.string().lowercase().required().email(),
    })

    static setNewPassword = joi.object({
        password: joi.string().required(),
        code : joi.string().required().trim()
    })

}




module.exports = Auth