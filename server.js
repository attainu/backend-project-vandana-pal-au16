require("dotenv").config();
const fileUpload = require('express-fileupload')
const expHbs = require('express-handlebars')
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./models/userInfo');
const cartModel = require('./models/cartInfo');
const productModel = require('./models/productInfo');
const { connect } = require("http2");
const dbURL = process.env.URL;
const app = express();



app.engine('hbs', expHbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload({}))

// mongoose database connection
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, async (err) => {
    if (err) throw err
}
)

let username="";

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

app.get('/', async (req, res) => {
    let user =await userModel.findOne({ username: `${username}`,login:"true"});
    res.render('homepage',user)
})

app.get('/cart', async (req, res) => {
    let user =await cartModel.findOne({ username: `${username}`,login:"true"});
    res.render('cart',user)
})

// Css get requests

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


//post requests

// sending data to user collection in mongodb
app.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let myFile = req.files.avatar
    req.body["imgUrl"] = myFile.name;
    req.body["password"] = await bcrypt.hash(req.body.password, salt);
    req.body["login"] = "false";
    myFile.mv(`./uploads/${myFile.name}`, (err) => {
        if (err) {
            res.status(300).render("signup", {success:"false"});
            return
        }
    })
    const userdata = new userModel(req.body)
    await userdata.save()
    res.status(300).render("signup", {success:"true"});
})


// checking if info by user is correct or not
app.post('/', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        username=user.username;
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
            res.status(300).render("homepage", user);
        } else {
            res.status(300).render("login", {password:"Incorrect"});
        }
    }else{
        res.status(300).render("login", {password:"Incorrect"});
    }
})

// searching items from produts collection in mongodb
app.get(`/search/:product`,async(req, res) => {
    let product =  await productModel.find({search:req.params.product})
    res.send(product)
})

//sending data to cart of spectific user 
app.post('/sendcartdata', async (req, res) => {
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
                img_Url : req.body.img_Url,
                price:req.body.price
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

// receiving data from cart
app.post('/receivecartdata', async (req, res) => {
    const user = await cartModel.findOne({ username: req.body.username });
    let cartdata = new cartModel(req.body)
    if (user) {
    res.status(300).json({ uploaded: "true" });
    cartdata= await cartModel.findOneAndUpdate(
        { username: req.body.username },
        {
            $set:{
                dish : req.body.dish,
                publisher : req.body.publisher,
                img_Url : req.body.img_Url,
                price : req.body.price,
            }
        })
    }
})

app.listen(process.env.PORT || 3000)