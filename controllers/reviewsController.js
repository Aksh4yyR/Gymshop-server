const reviewsModel=require('../models/userreviewModel')

exports.addReview =async(req,res)=>
{
    console.log("inside review controller");
    
    const{review,username}=req.body

    if(username&&review)
    {
       const newReview=new reviewsModel({
        username,review
       })
       await newReview.save()
       res.status(200).json(newReview)

    }
    else{
        res.status(400).json('review adding failed')
    }





}

exports.viewReview=async(req,res)=>
{
   try{
    const reviews=await reviewsModel.find()
    console.log(reviews);
if(reviews)
{
    res.status(200).json(reviews)
}
else
{
    res.status(400).json('Failed to fetch')
}
   }
   catch(err)
   {
    res.status(400).json(err)
   }
    
}