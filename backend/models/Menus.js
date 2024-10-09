const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  image: { type: String, required: true },
  comments: { type: String, required: true },
});

const Menus = new mongoose.Schema({
  group: { type: String, required: true },
  restaurant: { type: String, required: true },
  category: { type: String },
  subcategory: { type: String },
  item: { type: String, required: true },
  reviews: { type: [ReviewSchema], required: true },
  id: { type: Number, required: true },
});

const model = mongoose.model("Menus", Menus, "Menus");
module.exports = model;
