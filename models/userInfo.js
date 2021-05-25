const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    Username: String,
    email: String,
    password: String,
    imgUrl: String
})
const User = mongoose.model('User', UserSchema)
module.exports = User
