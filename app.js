const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

  
const bycrpt = require('bcrypt')
mongoose.connect('mongodb://0.0.0.0:27017/db', { useNewUrlParser: true });
mongoose.set('strictQuery', true);
const store = new MongoDBStore({
    uri: 'mongodb://0.0.0.0:27017/db',
    collection: 'users'
  });

  app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("assets"));
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir777",
    saveUninitialized:true,
    store: store,
    resave: false 
}))

const isAuth = (req,res,next)=>{
    if (req.session.isAuth){
        next()
    }
    else {
        res.redirect("/login.html")
    }
}

/*Getting webpages */


app.get('/index.html',isAuth, function(req,res){
   
    res.sendFile(__dirname + "/index.html");
       
})

app.get('/order.html',isAuth, function(req,res){
    if(!user) {res.redirect('/login.html')}
    else {res.sendFile(__dirname + "/order.html")};
              
})

app.get('/cancelorder.html',isAuth, function(req,res){
   
   res.sendFile(__dirname + "/cancelorder.html");
    
})

app.get('/delivery.html',isAuth, function(req,res){
    res.sendFile(__dirname + "/delivery.html");}
    
)

app.get('/contact.html', function(req,res){
  res.sendFile(__dirname + "/contact.html");
    
})

app.get('/login.html', function(req,res){
   
    res.sendFile(__dirname + "/login.html");
})

app.get('/register.html', function(req,res){
    res.sendFile(__dirname + "/register.html");
    
})

/* Getting webpages ends here */
 
//Creating MongoDB collection (Users)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String  
})
const user = mongoose.model("user", userSchema)

/* Post from webpages starts here */
app.post('/register', async function(req, res){
    var namee = req.body.name;
    var emaill = req.body.email ;
    var passwordd = await bycrpt.hash(req.body.password, 10); 
    var confirmPassword = req.body.confirmpassword;


    user.findOne({email: emaill }, function (err, users) {
        if (users === null) {const userReg = new user({name: namee, email: emaill, password:passwordd})
        userReg.save(); 
        res.sendFile(__dirname + "/registered.html")}

        else {res.sendFile(__dirname + "/userexist.html")};
    })});
            
           

app.post('/login.html', async function(req, res){
    var emaill = req.body.email ;
    var passwordd = req.body.password; 
    
    
    const foundUser=await user.findOne({email: emaill})
    if (!foundUser){
        return res.redirect("/login.html")
    }
    const isMatch = await bycrpt.compare(passwordd, foundUser.password)
    if (!isMatch) {
        return res.sendFile(__dirname + "/failedlogin.html")
        }
    else {
        req.session.isAuth = true;
        res.redirect('/index.html')
    }
    })
    

app.post('/logout', function(req, res){
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login.html');
    })
})
               
   
    
app.post('/order', function(req, res){
    var namee = req.body.name;
    var emaill = req.body.email ;
    var productName = req.body.productnamee;
    var phonee = req.body.phone; 
    var productId = req.body.productid;
    var quantityy = req.body.quantity;
    var shippingAd = req.body.shipping;
    console.log(namee, emaill, productName, productId, phonee, quantityy, shippingAd);

    const data = {productname: productName, productid: productId, quantities: quantityy};
    var jsonData = JSON.stringify(data);


    res.sendFile(__dirname + "/orderRecieved.html"); 
});

app.post('/cancelorder', function(req, res){
    var namee = req.body.name;
    var emaill = req.body.email;
    var productName = req.body.productnamee;
    var phonee = req.body.phone; 
    var productId = req.body.productid;
    var transactionID = req.body.transactionid; 
    console.log(namee, emaill, productName, productId, phonee, transactionID);
    

    res.sendFile(__dirname + "/cancelorderrecieved.html")
    

});


app.post('/delivery', function(req, res){
    var namee = req.body.name;
    var emaill = req.body.email ;
    var productName = req.body.productnamee;
    var phonee = req.body.phone; 
    var productId = req.body.productid;
    var transactionID = req.body.transactionid; 
    console.log(namee, emaill, productName, productId, phonee, transactionID);
    
    res.sendFile(__dirname + "/deliveryConfirmed.html")});

app.post('/contact', function(req, res){
    var namee = req.body.name;
    var emaill = req.body.email ;
    var phonee = req.body.phone; 
    var messagee = req.body.message;
    var subjectt= req.body.subject;
    console.log(namee, emaill, phonee, messagee, subjectt);

    res.sendFile(__dirname + "/contact.html")

});

/* Post from webpages ends here */

app.listen(3000, function(){console.log("Server is running on port 3000")});
