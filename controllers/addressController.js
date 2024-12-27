const addresses=require('../models/addressModel')

exports.addAddressController = async (req, res) => {
    console.log("Inside addAddress Controller");
  
    
    const { street, city, state, zipCode, country } = req.body;
  
 
    if (!req.user.id) {
      return res.status(401).json("User not authenticated");
    }
  
    
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json("Please provide all address fields");
    }
  
    try {
 
      const newAddress = new addresses({
        street,
        city,
        state,
        zipCode,
        country,
        user: req.user.id,  
      });
  
      
      await newAddress.save();
  
      
      res.status(200).json(newAddress);
      
    } catch (err) {
      console.error("Error adding address:", err);
      res.status(500).json("Error occurred while adding address");
    }
  };
exports. viewAddressController = async (req, res) => {
    console.log("Inside viewAddress Controller");

    // Check if the user is authenticated
   

    try {
        // Fetch all addresses associated with the logged-in user
        const userAddresses = await addresses.find();

        // Check if the user has any addresses
        if (!userAddresses ) {
            return res.status(404).json( "No addresses found for this user" );
        }

        // Respond with the user's addresses
        res.status(200).json( userAddresses );
    } catch (err) {
        console.error("Error fetching addresses:", err);
        res.status(500).json("An error occurred while fetching addresses" );
    }
};
exports.viewAddressUserController = async (req, res) => {
  console.log("Inside viewUserAddress Controller");

  // Check if the user is authenticated
  if (!req.user.id) {
      return res.status(401).json("User not authenticated");
  }

  try {
      // Fetch all addresses associated with the logged-in user
      const userAddresses = await addresses.find({ user: req.user.id });

      // Check if the user has any addresses
      if (!userAddresses ) {
          return res.status(404).json("No addresses found for this user");
      }

      // Respond with the user's addresses
      res.status(200).json(userAddresses);
  } catch (err) {
      console.error("Error fetching addresses:", err);
      res.status(500).json("An error occurred while fetching addresses");
  }
};




