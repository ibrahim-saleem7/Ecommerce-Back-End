const bcrypt = require('bcryptjs')

class General {
    
    static async hashPassword(body) {
        const salt = await bcrypt.genSalt(10)
        body.password = await bcrypt.hash(body.password , salt)
        return body.password
    }

    static async secretKey(item) {
        const secret = process.env.JWT_SECRET_KEY + item.password 
        return secret 
    }
    
    static async code() {
        return Math.floor(Math.random() * 100_000_000).toString(16);
    }




}



module.exports = General