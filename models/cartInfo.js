const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
        username : String,
        dish : Array,
        publisher : Array,
        img_Url : Array,
        login : String,
        price:Array
})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart
