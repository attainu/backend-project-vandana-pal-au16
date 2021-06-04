require("dotenv").config();
const fileUpload = require('express-fileupload')
const expHbs = require('express-handlebars')
const express = require('express');
const path = require('path');
const fs = require("fs")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./models/userInfo');
const cartModel = require('./models/cartInfo');
const app = express();
const dbURL = process.env.URL;

app.engine('hbs', expHbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload({}))

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, async (err) => {
    if (err) throw err
    console.log('Connected to database')
}
)

// get request

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', async (req, res) => {
    await userModel.findOneAndUpdate(
        {login:"true"},
        {
            $set:{
             login:"false"   
            }
    })
    res.render('login')
})

app.get('/homepage', async (req, res) => {
    let user =await userModel.findOne({ login: "true" })
    res.render('homepage',user)
})

app.get('/cart', async (req, res) => {
    const user = await cartModel.findOne({ login: "true"});
    res.render('cart', user)
})

// Css get request

app.get('/views/Css/login.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/login.css')
})
app.get('/views/Css/signup.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/signup.css')
})
app.get('/views/Css/homepage.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/homepage.css')
})

app.get('/views/Css/cart.css', (req, res) => {
    res.sendFile(__dirname + '/views/Css/cart.css')
})



//post request
app.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let myFile = req.files.avatar
    req.body["imgUrl"] = myFile.name;
    req.body["password"] = await bcrypt.hash(req.body.password, salt);
    req.body["login"] = "false";
    myFile.mv(`./uploads/${myFile.name}`, (err) => {
        if (err) {
            res.send({ uploaded: false })
            return
        }
    })
    const userdata = new userModel(req.body)
    console.log(userdata)
    await userdata.save()
    res.send({ uploaded: true })
})

app.post('/homepage', async (req, res) => {
    console.log("/login activated")
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            user = await userModel.findOneAndUpdate(
                { email: req.body.email },
                {
                    $set:{
                     login:"true"   
                    }
            })
            user["login"] = "true";
            console.log(user)
            res.status(300).render("homepage", user);
        } else {
            res.status(426).json({ error: "Invalid Password" });
        }
    } else {
        res.status(426).json({ error: "User does not exist" });
    }
})

app.post('/cartdata', async (req, res) => {
    const user = await cartModel.findOne({ username: req.body.username });
    let cartdata = new cartModel(req.body)
    if (user) {
    res.status(300).json({ uploaded: "true" });
    cartdata= await cartModel.findOneAndUpdate(
        { username: req.body.username },
        {
            $push:{
                dish : req.body.dish,
                publisher : req.body.publisher,
                img_Url : req.body.img_Url
            },
            $set:{
                login:"true"   
               }
        })
    }
    else{
    await cartdata.save()
    res.status(300).json({ uploaded: "true" });
    }
})

app.listen(process.env.PORT || 3000)
// app.listen(3000, () => console.log('Server Started http://localhost:3000/'))