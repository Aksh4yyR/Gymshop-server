const products = require('../models/productsModel');
const User = require('../models/userModel');
const orders=require('../models/orderModel')
// const cart=User.cart
exports.addProductsbyAdmin = async (req, res) => {
  console.log("Inside addProductsbyAdmin");
  
  const { name, category, price, description } = req.body;
  const image = req.file?.filename; 
  
  console.log(name, category, price, description, image);
  
  try {
    
    const existingProduct = await products.findOne({ name, category });
    if (existingProduct) {
      return res.status(406).json({ message: "Product already exists in the same category. Please add a new one." });
    }

   
    if (!name || !category || !price ||  !description || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    
    const newProduct = new products({
      name,
      category,
      price,
      description,
      image, 
    });

    
    await newProduct.save();
    res.status(200).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Failed to add product. Please try again.", error: err.message });
  }
};
exports.editProductsController = async (req, res) => {
  console.log("Inside editProductsController");

  const { id } = req.params;
  const { name, category, price, description } = req.body;
  const image = req.file?.filename;

  console.log(id, name, category, price, description, image);

  try {
    
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "All fields (name, category, price, description, image) are required." });
    }

    
    const updatedProduct = await products.findByIdAndUpdate(
      id,
      { name, category, price, description, image },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product. Please try again.", error: err.message });
  }
};
exports.viewProductsController = async (req, res) => {
  try {

    
    const allProducts = await products.find({});

    
    if (!allProducts) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      });
    }

   
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: allProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteProductByAdmin = async (req, res) => {
  console.log("Inside deleteProductByAdmin");

  const { id } = req.params; 

  try {
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    
    const deletedProduct = await products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully.", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product. Please try again.", error: err.message });
  }
};


//users
exports.viewUserProductsController = async (req, res) => {
  console.log("Inside view user controller");

  try {
    // Extract category from query parameters
    const { category } = req.query;

    // Define filter criteria for the query
    const filterCriteria = {}; // Start with an empty filter

    // If category is provided, add it to the filter criteria
    if (category) {
      filterCriteria.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive match
    }

    // Fetch products based on the filter criteria
    const userProducts = await products.find(filterCriteria);

    // If no products found, send a response indicating no products
    if (!userProducts || userProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products available for the given criteria.',
      });
    }

    // Send the found products in the response
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully.',
      data: userProducts,
    });
  } catch (error) {
    console.error('Error fetching user products:', error);

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};






// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Find the product by ID
    const product = await products.findById(productId); // Ensure model name is correct
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      // If the product is already in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Product added to cart', cart: user.cart });
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
      const { productId } = req.body;
      const userId = req.user.id; // Assuming you are using JWT to authenticate users

      if (!productId) {
          return res.status(400).json({ message: 'Product ID is required' });
      }

      // Find the product by ID
      const product = await products.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the product is already in the wishlist
      if (user.wishlist.includes(productId)) {
          return res.status(400).json({ message: 'Product is already in the wishlist' });
      }

      // Add product to wishlist
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// View user's cart
exports.viewCart = async (req, res) => {
  try {
      const userId = req.user.id;  // Assumes JWT is used and `req.user` is populated by middleware

      // Find the user and populate the cart with product details from 'products'
      const user = await User.findById(userId).populate('cart.product');  // Populate cart.product with 'products'

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // If the cart is empty, return an empty array
      if (user.cart.length === 0) {
          return res.status(200).json({ cart: [] });
      }

      // Send the populated cart as the response
      res.status(200).json({ cart: user.cart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




// Purchase cart
exports.purchaseCart = async (req, res) => {
  try {
      const userId = req.user.id; // Assuming you are using JWT to authenticate users
      const user = await User.findById(userId).populate('cart.product');
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // You can integrate payment processing here (e.g., Razorpay)

      // Assuming payment is successful, we can clear the cart
      user.cart = [];
      await user.save();

      res.status(200).json({ message: 'Purchase successful', cart: user.cart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.viewWishlist = async (req, res) => {
  try {
      const userId = req.user.id; // Assuming you are using JWT to authenticate users

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Fetch the products in the user's wishlist
      const wishlistProducts = await products.find({ '_id': { $in: user.wishlist } });

      res.status(200).json({
          message: 'Wishlist fetched successfully',
          wishlist: wishlistProducts // Return the list of products in the wishlist
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.editCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body; // Assuming quantity is passed in the request body

    // Find the user and the cart item to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item by product ID
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity of the product in the cart
    cartItem.quantity = quantity;

    // Save the user with the updated cart
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete from cart
exports.deleteFromCart = async (req, res) => {
  console.log("Inside deleteFromCart");

  try {
    const { productId } = req.params; // Get productId from URL parameter
    console.log('Product ID:', productId);

    const userId = req.user.id; // Get userId from the middleware
    console.log('User ID:', userId);

    // Find the user and populate the cart
    const user = await User.findById(userId).populate('cart.product');
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists in the cart
    const productIndex = user.cart.findIndex((item) => {
      // Check if item.product and item.product._id are both defined
      if (item.product) {
        return item.product;
      }
      return false; // Return false if product or _id is undefined
    });

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Log cart before deletion for debugging
    console.log('Cart before deletion:', user.cart);

    // Remove the product from the cart
    user.cart.splice(productIndex, 1);

    // Log cart after deletion for debugging
    console.log('Cart after deletion:', user.cart);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Product removed from cart", cart: user.cart });

  } catch (error) {
    console.error("Error removing product from cart:", error); // More detailed error logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



//ordersss controllers
exports.addOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products: orderItems } = req.body; // Renaming products to orderItems

    // Basic validation
    if (!orderItems || !orderItems.length) {
      return res.status(400).json({ message: 'Product list is required' });
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderProducts = [];

    for (let item of orderItems) {
      const product = await products.findById(item.productId); // Use Product model
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }

      const amount = product.price * item.quantity;
      totalAmount += amount;

      orderProducts.push({ product: item.productId, quantity: item.quantity });
    }

    // Create the new order
    const newOrder = new orders({
      user: userId,
      products: orderProducts,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteFullCart = async (req, res) => {
  console.log("Inside deleteFromCart");

  try {
    const userId = req.user.id; // Get userId from the middleware
    console.log('User ID:', userId);

    // Find the user and populate the cart
    const user = await User.findById(userId).populate('cart.product');
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log cart before deletion for debugging
    console.log('Cart before deletion:', user.cart);

    // Clear the entire cart by resetting it to an empty array
    user.cart = [];

    // Log cart after deletion for debugging
    console.log('Cart after deletion:', user.cart);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully", cart: user.cart });

  } catch (error) {
    console.error("Error clearing cart:", error); // More detailed error logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.editOrder = async (req, res) => {
  try {
    console.log('inside edit order controller');
    
    const orderId = req.params.id; // Get the order ID from the URL params
    const { status } = req.body; // Get updated status and products from request body

  
    
    if (!status) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // Find the order by ID
    const order = await orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `Order with ID ${orderId} not found` });
    }


    if (status) {
      order.status = status;
    }

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.viewOrders=async(req,res)=>
{
  console.log('inside view orders controller');
  try{
    const orderList=await orders.find()
    if(orderList)
    {
      res.status(200).json(orderList)
    }
    else{
      res.status(401).json('Fetching failed')
    }
  }
  catch(err)
  {
    res.status(401).json('failed')
  }
  

}
exports.viewOrdersByUser = async (req, res) => {
  console.log('Inside view orders controller for user');
  try {

    const userId = req.user.id; // Extract user ID from middleware
    const userOrders = await orders.find({ user:userId });

    if (userOrders) {
      res.status(200).json(userOrders);
    } else {
      res.status(404).json({ message: 'No orders found for this user' });
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch user orders. Please try again later.' });
  }
};




















