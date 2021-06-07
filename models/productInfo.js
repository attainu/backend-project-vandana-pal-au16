const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  publisher: String,
  search: String,
  title: String,
  source_url: String,
  recipe_id: String,
  image_url: String,
  price: Number,
});
const products = mongoose.model("products", productsSchema);
module.exports = products;
