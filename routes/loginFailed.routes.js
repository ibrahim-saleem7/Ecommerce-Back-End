const router = require('express').Router() 
const Token = require('../middlewares/verifyToken')
const LoginFailedController = require('../controllers/loginFailed.controller')






router  // /api/v1/trash
    .route("/")
    .get(Token.authAdmin(['gm']),LoginFailedController.getAllLoginFailed)
    .delete(Token.authAdmin(['gm']),LoginFailedController.deleteAllLoginFailed)

router.put('/reverify/:id',Token.authAdmin(['gm']),LoginFailedController.reverify)


module.exports = router