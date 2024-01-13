const trashModel = require('../models/trash.model');





async function addToTrash(trash){
    await trashModel.create(trash)
}

module.exports = addToTrash;
