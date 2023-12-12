const router = require('express').Router() 
const  validation  = require('../middlewares/validation')
const Token = require('../middlewares/verifyToken')
const UserController = require('../controllers/user.controller')
const UserValidation = require('../validations/user.validation')
const fileUpload = require('../utils/fileUpload')
const WishlistController = require('../controllers/wishlist.controller')






router  // /api/v1/user
    .route("/")
    .get(UserController.getAllUsers)
    .post(fileUpload('imageProfile'),validation(UserValidation.addUser),UserController.addUser) 



router  // /api/v1/user/:id
   .route("/:id")
   .get(UserController.getUserById)
   .delete(UserController.deleteUserById)
   .put(fileUpload('imageProfile'),validation(UserValidation.updateUser),UserController.updateUser)


router  // /api/v1/user/wishlist
   .route("/wishlist")
   .post(validation(UserValidation.addWishlist),WishlistController.addWishlist)
   .delete(validation(UserValidation.deleteWishlist),WishlistController.deleteWishlistById) 



module.exports = router