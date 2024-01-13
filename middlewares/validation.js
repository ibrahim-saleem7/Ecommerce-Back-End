const AppError = require("../utils/appError.js");
const fs = require("fs");
const path = require("path");
function validation(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (req.files)
        for (let file in req.files) {
          req.files[file].map((f) => {
            return fs.unlink(path.join(__dirname, "../uploads/", f.filename), (err) =>
             err? null: null
            );
          });
        }

      next(new AppError(error.details[0].message, 400));
    } else next();
  };
}

module.exports = validation;
