const mongoose=require('mongoose')
connection=process.env.DBCONNECTIONSTRING

mongoose.connect(connection).then(res=>{console.log("MongoDB Connection successfull")}).catch(err=>{console.log("MongoDB connection failed")
})
