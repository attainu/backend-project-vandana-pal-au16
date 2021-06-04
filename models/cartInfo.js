const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
        username : String,
        dish : Array,
        publisher : Array,
        img_Url : Array,
        login : String,
        total:Number
})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart
