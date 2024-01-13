const multer = require("multer")
const AppError = require('../utils/appError');

module.exports = fileUpload = (...params)=> {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {

            cb(null, "uploads/")
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname )
        }
        
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('application/pdf')) {
            cb(null, true)
        }
        else {
            cb(null, false)
        }
    }
    const upload = multer({storage, fileFilter, limits: {fileSize: 4 * 1024 * 1024 },})
    return upload.fields([
        {name: params[0], maxCount:5},
        {name: params[1], maxCount:5},
        {name: params[2], maxCount:5},
        {name: params[3], maxCount:5}
        ])
        

}