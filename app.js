const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

var app = express();

app.set('view engine', 'ejs');
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
   item: String,
   price: Number,
   img: String,
   type: String
});

var logdb = new mongoose.Schema({
   name: String,
   mail: String,
   pwd: String,

});

var loguser = mongoose.model('loguser', logdb)


var Cakes = mongoose.model('Cakes', cake)

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

app.get('/login', (req, res) => {
   res.render('login');
});

app.post('/auth', (req, res) => {

   var user = req.body.username;
   var pwd = req.body.password;

   if (loguser.find({ name: user, pwd: pwd })) {
      req.session.loggedin = true;
      req.session.username = user;
      res.redirect('/')
   }
})

app.get('/', (req, res) => {
   Cakes.find({}, (err, data) => {
      if (err) {
         throw err
      } else {
         if (req.session.loggedin) {
            res.render('index', { items: data, name: req.session.username })
         }
         else {
            res.render('index', { items: data, name: null })
         }
      }
   });
})

app.get('/signup', (req, res) => {
   res.render('Register')
})

app.post('/signup', (req, res) => {
   var signup = loguser(req.body).save((err, data) => {
      if (err) {
         throw err
      } else {
         res.redirect('login')

      }
   })

})

app.post('/login', (req, res) => {
   res.render('login')
})

app.listen(5000, () => {
   console.log('Server is running!');
});
