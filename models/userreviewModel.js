

const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    review: { type: String, required: true }
    
  }
  
);

const reviews = mongoose.model('reviews', userReviewSchema);

module.exports = reviews;
