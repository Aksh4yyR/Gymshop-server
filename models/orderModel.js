
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, default: 'Pending' }, //  statuses: Pending, Processing, Shipped, Delivered, Cancelled
    totalAmount: { type: Number, required: true },
  },
 
);
const orders=new mongoose.model("orders",OrderSchema)

module.exports = orders;
