const { v4: uuidv4 } = require("uuid");
const {BadRequest} = require('http-errors')
const asyncHandler = require('../middlewares/async')
const { createClient } = require("redis");
const client = createClient();

const User = require('../models/user')
const {sendAccountActivationEmail} = require('../services/email')

const createUser =asyncHandler( async (req, res)=>{
    const token = uuidv4()
    const isEmailExist = await User.findOne({email:req.body.email})
    if(isEmailExist) throw new BadRequest('Email Already Exist')
    const user = new User(req.body)
    const newUser = await user.save()
    const userData = {
        id: user._id,
        email: user.email,
      };
      await client.connect();
      await client.hSet(token, userData);
      await client.disconnect()
      await sendAccountActivationEmail(token, user)
        res.status(201).json({
        success: true,
        data: newUser
    })
})
const login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body
    const user = await User.findOne({email: req.body.email})
    if(!user) throw new NotFound('User with this email does not exists')
    const valid = await bcrypt.compare(password, user.password)
    if(!valid) throw new BadRequest('invalid password')
    const sessionData =  {
        id: user._id,
        authenticated: true, 
        role: user.role

    }
    req.session.user = sessionData
    
    res.status(200).json({
        success:true,
        data:user
    })


})


const getOneUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({_id:req.session.user.id})
    res.status(200).send({
        success: true, 
        data: user
    })
})


const getAllUsers = asyncHandler(async (req, res, next) => {
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
    console.log(req.session)
    // const user = await User.find().populate('wallet')
    res.status(201).json({
        success:true, 
        data:''
    })
})

const updateUser = asyncHandler(async (req, res, next) => {
    try{
        if(!req.params.id) {
            throw new BadRequest('id must be provided!')
        }
       let user = await User.findById(req.params.id)
       if(!user) {
        throw new NotFound('no user with id exist')
       }
       user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
       })
       res.status(200).json({
           success:true,
           data: user
       })

    }catch(e){
        next(e)
    }
})

const  deleteUser = asyncHandler(async (req, res, next) => {
    try{
    await User.findByIdAndDelete(req.params.id)
       res.status(200).json({
           success:true,
           data: {}
       })

    }catch(e){
        next(e)
    }
})


module.exports = {
    createUser,
    login,
    getOneUser,
    getAllUsers,
    updateUser,
    deleteUser
}