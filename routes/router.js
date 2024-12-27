const express=require('express')
const router=new express.Router()
const userController=require('../controllers/userController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')
const userMiddleware=require('../middlewares/userMiddleware')
const multerMiddleware =require('../middlewares/multerMiddleware')
const productsController=require('../controllers/productsController')
const reviewsController =require('../controllers/reviewsController')

const addressController=require('../controllers/addressController')
//register
router.post('/register',userController.registerController)
//login
router.post('/login',userController.loginController)
//view users
router.get('/viewusers',jwtMiddleware,userController.viewUsersController)

//delete users
router.delete('/user/:id/delete',jwtMiddleware,userController.delteUsersController)

//add-products by Admin
router.post('/add-products',jwtMiddleware,multerMiddleware.single('image'),productsController.addProductsbyAdmin)

//edit-product by admin
router.put('/edit-product/:id',jwtMiddleware,multerMiddleware.single('image'),productsController.editProductsController);
  
//delete products by admin
router.delete('/delete-product/:id', jwtMiddleware, productsController.deleteProductByAdmin);

//view products by admin
router.get('/view-products', jwtMiddleware, productsController.viewProductsController);

//view products by user

router.get('/viewProducts', userMiddleware, productsController.viewUserProductsController);


// Add product to cart
router.post('/add-to-cart', userMiddleware,productsController.addToCart);

// Add product to wishlist
router.post('/add-to-wishlist', userMiddleware, productsController.addToWishlist);

// View cart
router.get('/view-cart', userMiddleware, productsController.viewCart);

// Purchase cart
router.post('/purchase-cart', userMiddleware,productsController.purchaseCart);

router.get('/wishlist', userMiddleware, productsController.viewWishlist);

//edit cart
router.put('/editcart/:id',userMiddleware,productsController.editCart)
//deletecart
router.delete('/delete-cart/:id/delete',userMiddleware,productsController.deleteFromCart)

//add order
router.post('/add-order',userMiddleware,productsController.addOrder)

//full cart delete
router.delete('/delete-full-cart', userMiddleware,productsController.deleteFullCart );

//add reviews
router.post('/add-review',userMiddleware,reviewsController.addReview)

//view reviews
router.get('/view-reviews',reviewsController.viewReview)

//edit orders by admin
router.put('/edit-order/:id',jwtMiddleware,productsController.editOrder)

//add address by user
router.post('/add-address',userMiddleware,addressController.addAddressController)
//view address by admin
router.get('/view-address',addressController.viewAddressController)
//view address by user
router.get('/view-address-user',userMiddleware,addressController.viewAddressUserController)
//admin-view-orders
router.get('/view-orders',jwtMiddleware,productsController.viewOrders)
//user-view their orders

router.get('/user-orders', userMiddleware, productsController.viewOrdersByUser);

module.exports=router
