const joi = require('joi');


class AdmissionStatus {

    static addAdmissionStatus = joi.object({
        name: joi.string().required().trim(),
        value: joi.string().required().trim(),
    })

    
}




module.exports = AdmissionStatus