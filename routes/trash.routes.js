const router = require('express').Router() 
const Token = require('../middlewares/verifyToken')
const TrashController = require('../controllers/trash.controller')





router  // /api/v1/trash
    .route("/")
    .get(Token.authAdmin(['gm']),TrashController.getAllTrash)
    .delete(Token.authAdmin(['gm']),TrashController.deleteAllTrash)



module.exports = router