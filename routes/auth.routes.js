// const validation = require("../middlewares/validation.js");
const router = require("express").Router();
const AuthController  = require("../controllers/auth.controller");
const validation = require("../middlewares/validation");
const Token = require("../middlewares/verifyToken");
const Auth = require("../validations/auth.validation");
const emailAuth = require("../utils/emailAuth.js");
const {limiter} = require("../middlewares/limiter.js");





// /api/auth/login
router.post('/login',limiter(4,true),validation(Auth.login), AuthController.login)

// /api/auth/checkUser
router.post('/checkUser',validation(Auth.checkUser), AuthController.checkUser)

// /api/auth/otp/:id
router.post('/otp/:id',limiter(4,true),validation(Auth.otp), AuthController.otp)

// /api/auth/forgot-password'
router.post('/forgot-password', limiter(4,false) ,validation(Auth.email), AuthController.forgotPassword)

// /api/auth/reset-password/:id/:token
router.post('/reset-password/:id/:token',validation(Auth.setNewPassword), AuthController.resetPassword)

// /api/auth/change-password
router.post('/change-password',limiter(3,true),Token.verifyToken,validation(Auth.login), AuthController.changePassword)

// /api/auth/set-new-password/:id/:token
router.put('/set-new-password/:id/:token',Token.verifyToken,validation(Auth.setNewPassword), AuthController.setNewPassword)

// /api/auth/confirm/:token
router.get('/confirm/:token', Token.verifyEmailToken , AuthController.confirmEmail)



module.exports = router;
