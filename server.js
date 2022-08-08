const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const RedisStore = require("connect-redis")(session)
require('dotenv').config()
const mongoConn = require('./config/mongoConn')
const app = express()

const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "naruto-uzumaki",
      resave: false,
    })
  )

mongoConn()



app.use(express.json())



app.use('/user', require('./routes/user'))


mongoose.connection.once('open', ()=>{
    console.log('DB connected')
    app.listen(process.env.PORT,()=>{console.log(`server is running on port ${process.env.PORT}`)})
})
