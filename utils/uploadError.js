const fs = require("fs");
const path = require("path");




function uploadError(req){
    for (let file in req.files) {
        req.files[file].map((f) => {
          return fs.unlink(path.join(__dirname, "../uploads", f.filename), (err) =>
           err? null: null
          );
        });
      }
}

module.exports = uploadError

