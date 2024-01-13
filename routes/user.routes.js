const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const UserController = require('../controllers/user.controller')
const UserValidation = require('../validations/user.validation')
const fileUpload = require('../utils/fileUpload')






router  // /api/v1/user
    .route("/")
    .get(Token.authAdmin(['gm']),UserController.getAllUsers)
    .post(Token.authAdmin(['gm']),fileUpload('imageProfile'),validation(UserValidation.addUser),UserController.addUser) 



router  // /api/v1/user/:id
   .route("/:id")
   .get(Token.verifyToken,UserController.getUserById)
   .put(Token.authAdmin(['gm']),fileUpload('imageProfile'),validation(UserValidation.updateUser),UserController.updateUser)





module.exports = router