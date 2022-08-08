const mongoose = require('mongoose')

const   mongoConnect = async ()=>{
    try {
        await mongoose
            .connect(process.env.DATABASE_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoConnect


