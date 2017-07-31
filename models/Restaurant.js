// connect to db
const mongoose = require('mongoose');

const conn = require('../connect');

//
const Schema = mongoose.Schema;
//
const RestaurantSchema = new Schema({
  resId: String,
  name: String,
  url: String,
  address: String,

  averageCostForTwo: Number,
  thumbUrl: String,
  aggregateRating: Number,

  photoUrl: String,
  menuUrl: String,
  featuredImageUrl: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
//
const Restaurant = conn.model('Restaurant', RestaurantSchema);
//
module.exports = Restaurant;
