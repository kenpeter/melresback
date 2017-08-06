// connect to db
const mongoose = require('mongoose');

const conn = require('../connect');

//
const Schema = mongoose.Schema;
//
const RestaurantVoteSchema = new Schema({
  restaurant: { type: String, ref: 'Restaurant' },
  voteUpCount: { type: Number, default: 0 },
  voteDownCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
//
const RestaurantVote = conn.model('RestaurantVote', RestaurantVoteSchema);
//
module.exports = RestaurantVote;
