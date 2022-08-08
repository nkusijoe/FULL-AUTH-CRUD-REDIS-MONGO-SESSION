const Joi = require('joi')
const {BadRequest} = require('http-errors')

const validateCreateUser = async (req, res, next) => {
    try{
        const createUserSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            role: Joi.string().required(),
            password:Joi.string().required()
        })
       await  createUUserSchema.validateAsync(req.body)
       next()
    }catch(e){
        next(BadRequest(e.message))
    }
}


const validateUpdateUser = async (req, res, next) => {
    try{
        const updateUserSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password:Joi.string().required()
        })
       await  updateUserSchema.validateAsync(req.body)
       next()
    }catch(e){
        next(BadRequest(e.message))
    }
}

module.exports = {
    validateCreateUser,
    validateUpdateUser
}