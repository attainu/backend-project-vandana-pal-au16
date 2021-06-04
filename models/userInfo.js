const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        imgUrl: String,
        login:String
})
const User = mongoose.model('User', UserSchema)
module.exports = User
