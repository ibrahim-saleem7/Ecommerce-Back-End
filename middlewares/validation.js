
function validation(schema) {

    return (req , res , next) => {
        const {error} = schema.validate(req.body ,{abortEarly: false})
        if (!error) {
            next()
        }else{
            res.status(401).json({message: error.details[0].message})
        }
    }

}

module.exports =validation