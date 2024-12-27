const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true }
    }],
    wishlist: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
       
    }]
});

const users = new mongoose.model('users', userSchema);

module.exports = users;
