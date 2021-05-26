const fileUpload = require('express-fileupload')
const expHbs = require('express-handlebars')
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');
const dbURL = "mongodb+srv://AryanMalik:Malik2001@cluster0.xmqot.mongodb.net/food_cafe?retryWrites=true&w=majority";
const UserModel = require('./models/userInfo');

const app = express();

app.engine('hbs', expHbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload({}))

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, async (err) => {
    if (err) throw err
    console.log('Connected to database')
}
)

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let myFile = req.files.avatar
    req.body["imgUrl"] = myFile.name
    req.body["password"] = await bcrypt.hash(req.body.password, salt);
    const userdata = new UserModel(req.body)
    console.log(userdata)
    await userdata.save()
    res.send({ uploaded: true })
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            res.status(200).json({ message: "Valid password" });
        } else {
            res.status(400).json({ error: "Invalid Password" });
        }
    } else {
        res.status(600).json({ error: "User does not exist" });
    }
})

app.get('/views/Css/login.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/login.css')
})

app.get('/views/Css/signup.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/signup.css')
})

app.get('/views/Css/landingPage.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/landingPage.css')
})
app.listen(process.env.PORT || 3000)
// app.listen(3000, () => console.log('Server Started http://localhost:3000/signup'))