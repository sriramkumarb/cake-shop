const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const session = require('express-session');

var app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
   secret: 'sdfghjkl',
   resave: true,
   saveUninitialized: true,
}));


mongoose.connect('mongodb://localhost', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        throw err
    } else {
        console.log('MongoDb Connected');
        
    }
});

var cake = new mongoose.Schema({
   item :String,
   price : Number,
   img :String,
   type:String
});

var logdb = new mongoose.Schema({
  name:String,
  pwd: String
});

var loguser = mongoose.model('loguser',logdb)


var Cakes = mongoose.model('Cakes',cake)

// app.get('/' ,(req,res) => {
//    Cakes.find({}, (err,data) =>{
//     if(err){
//        throw err
//     }else{
//        res.render('index',{items:data})
//        console.log(data);
       
//     }
//    })
// });

app.get('/login' , (req,res) =>{
   res.render('login');
});

app.post('/auth' , (req,res) =>{
 
   var user=req.body.username;
   var pwd=req.body.password;
   var a='hari';
   var b='haran';
   if(a == user && b == pwd){
      req.session.loggedin = true;
      res.redirect('/')
   }
})

app.get('/', (req,res) =>{
   if(req.session.loggedin){
      Cakes.find({}, (err,data) =>{
         if(err){
            throw err
         }else{
            res.render('index',{items:data})
            console.log(data);
            
         }
        });
   }
   else{
      res.redirect('/login')
   }
})

app.listen(5000, ()=>{console.log('Server is running!');
});
