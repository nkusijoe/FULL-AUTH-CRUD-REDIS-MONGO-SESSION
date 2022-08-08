const {Schema, default: mongoose} = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
    
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      
      role: {
        type: String, 
        enum: ['user', 'admin'],
        default:'user'
      },
    
      active:{
        type: Boolean, 
        default: false
      },
    
      password: {
        type: String,
        required: true,
        minlength: 9,
      }

})
userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        const hash = await bcrypt.hash(this.password,10)
        this.password = hash
    }
    next()
})
const user = mongoose.model('user',userSchema)

module.exports = user