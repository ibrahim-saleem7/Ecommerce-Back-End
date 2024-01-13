const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError.js")


class Token {

    static verifyToken(req, res, next ) { 
        let token = req.headers.token;
        if (token) {

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = decoded 
                next()
            }
            catch (err) {
                return res.status(401).json({message : 'Required Login'})
            }
        } else {
            return res.status(401).json({message : 'Required Login'})
        }
    }
    
//     static authUserAndAdmin(permission) {
//         return (req , res , next) => {
//             Token.verifyToken(req, res, ()=>{
//                 const permissions = req?.user?.role?.permissions 
//                 if(req.user.id == req.params.id || (req?.user?.type === 'admin' && permissions.includes(...permission))){

//                     next()
//                 }else{
//                     return res.status(403).json('you are not allowed')
//                 }
//             })
//     }
// }

    static authAdmin(permissionsAllowed) {
        return (req, res , next) => {
            Token.verifyToken(req, res, ()=>{
                if(!req.user?.role) return res.status(403).json({message: 'you are not allowed'})
                const permission = req?.user?.role
                if(permissionsAllowed.includes(permission)){

                    next()
                }else{
                    return res.status(403).json({message: 'you are not allowed'})
                }
            })
        }

    }


    static verifyEmailToken = (req, res, next)=> {
        const { token } = req.params
        jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
            if (err) {
                return res.status(500).json({message : err.message})
            }
            else {
                req.email = decoded.email
                next()
            }
        })
    }

  }



module.exports = Token 