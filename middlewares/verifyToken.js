const jwt = require('jsonwebtoken');


class Token {
    static verify(req, res, next) { 
        const token = req.headers.token;
        if (token) {
            
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = decoded 
                next()
            }
            catch (err) {
                res.status(401).json({message : err.message})
            }
    
        } else {
            res.status(401).json({ message: 'no token provided' }) 
        }
    }
    
    static verifyAndAuth(req, res, next) {
        verifyToken(req, res, ()=>{
            if(req.user.id == req.params.id || req.user.isAdmin){
                next()
            }else{
                return res.status(403).json({message : 'you are not allowed '})
            }
        })
    }
    
    static verifyAndAdmin(req, res, next) {
        verifyToken(req, res, ()=>{
            if(req.user.isAdmin){
                next()
            }else{
                return res.status(403).json({message : 'you are not allowed , only admins are allowed'})
            }
        })
    }
}


module.exports = Token