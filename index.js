const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const PORT =process.env.PORT

const productRoute = require('./routes/productsRoute')
const categorytRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')
app.use('/api/products',productRoute)
app.use('/api/category',categorytRoute)
app.use('/api/user',userRoute)
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:3000',
    
  };
 



mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("connected")
        app.listen(process.env.PORT,()=>{
            console.log("server is running on port ${PORT}")
        })
    }
).catch(()=>{
    console.log("connection failed")
})





