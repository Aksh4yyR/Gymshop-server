const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    category:{type:String,required:true},
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }
})

const products=new mongoose.model("products",productSchema)
module.exports=products