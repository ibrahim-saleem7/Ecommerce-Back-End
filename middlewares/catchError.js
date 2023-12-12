const uploadError = require('../utils/uploadError')



module.exports = catchAsyncError = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(err=>{
            uploadError(req)
            next(err)
        })
    }
}