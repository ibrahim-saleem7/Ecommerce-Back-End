const jwt = require('jsonwebtoken');

function generateToken (payload){
    return jwt.sign(payload ,process.env.JWT_SECRET_KEY)
}

module.exports = generateToken;