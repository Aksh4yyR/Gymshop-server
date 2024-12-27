const users = require("../models/userModel")
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
exports.registerController=async(req,res)=>
{
    console.log("Inside register Controller");
    
    const{username,email,password,role}=req.body
   if(username&&email&&password&&role)
   {
    try{
        const hashPassword= await bcrypt.hash(password,10)

        const existingUser=await users.findOne({email})
    
        if(existingUser)
        {
            res.status(401).json("User Allready exists")
        }
        else{
            const newUser=new users({
                username,email,password:hashPassword,role
            })
            await newUser.save()
            res.status(201).json({"users":newUser})
        }
    
    }
    catch(err)
    {
        console.log(err);
        res.status(401).json("Error")
        
    }
   }
   else{
    res.status(401).json("Fill all the fields")
   }

}

exports.loginController = async (req, res) => {
  console.log("Inside login Controller");

  const { email, password } = req.body;

  if (email && password) {
    try {
    
      const existingUser = await users.findOne({ email });

      if (!existingUser) {
        return res.status(404).json("User does not exist");
      }

     
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordValid) {
        return res.status(401).json("Invalid credentials");
      }

     
      const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        process.env.JWTPASSWORD 
        
      );

     
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(401).json("Error occurred while logging in");
    }
  } else {
    res.status(401).json("Please provide email and password");
  }
};

exports.viewUsersController=async (req,res)=>{
  console.log("inside view user controller");
 try{
  const userRole=req.user.role
  if(userRole=="admin"){
    const fullUsers=await users.find({role:'user'})
    res.status(200).json(fullUsers)
  }

 }
 catch(err){
  console.log(err);
  
 }
  
  
}

exports.delteUsersController=async(req,res)=>
{
  console.log("inside delete user controller");

  
  const { id } = req.params;

  try {
 
    const user = await users.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const deleteduser = await users.findByIdAndDelete(id);
    
    // Send response with deleted task details (or a success message)
    res.status(200).json({ message: " Deleted successfully", deleteduser });
  } catch (error) {
    console.error("Error deleting", error);
    res.status(401).json({ message: "An error occurred while deleting the user" });
  }
  
}

exports.addAddressController = async (req, res) => {
  console.log("Inside addAddress Controller");

  const { street, city, state, zipCode, country } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json("User not authenticated");
  }

 
  if (!street || !city || !state || !zipCode || !country) {
    return res.status(400).json("Please provide all address fields");
  }

  try {
   
    const user = await users.findById(req.user.id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Update the user's address
    user.address = { street, city, state, zipCode, country };
    await user.save();

    // Respond with the updated user
    res.status(200).json({
      message: "Address added successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        address: user.address, // Return the updated address
      },
    });
  } catch (err) {
    console.error("Error adding address", err);
    res.status(500).json("Error occurred while adding address");
  }
};
