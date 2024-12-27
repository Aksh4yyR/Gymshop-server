const express=require('express')
const cors=require('cors')
require('dotenv').config()
require('./Database/dbConnection')
const router=require('./routes/router')
const GSserver=express()

GSserver.use(cors())
GSserver.use(express.json())
GSserver.use(router)
GSserver.use('/uploads',express.static('./uploads'))

const PORT=3000 || process.env.PORT

GSserver.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

GSserver.get(('/'),(req,res)=>{res.status(200).send('<h1>GSserver is running</h1>')})