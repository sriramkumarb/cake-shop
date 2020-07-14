require('dotenv').config();

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


mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
   if (err) {
      throw err
   } else {
      console.log('MongoDb Connected');

   }
});

var cake = new mongoose.Schema({
   item: String,
   price: String,
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

   // loguser.find({ name:user }, (err, data) => {


   //    if (err) {
   //       throw err
   //    }
   //    else {
   //       if (data) {
   //          req.session.loggedin = true;
   //          req.session.username = user;
   //          console.log("user", user);

   //          res.redirect('/')
   //       }
   //       else {
   //          console.log("wrong")

   //       }
   //    }

   // })
   loguser.findOne({ name: user }).then(user => {
      if (user) {
         if (user.pwd == pwd) {
            console.log(user);
            req.session.username = user.name;
            req.session.loggedin = true;
            res.redirect('/')
         }
         else {
            console.log("incorrect password")
            res.render('login')
         }
      }
      else {
         console.log("no user found")
      }
   })
})

app.get('/', (req, res) => {
   Cakes.find({}, (err, data) => {
      if (err) {
         throw err
      } else {
         if (req.session.loggedin) {
            res.render('index', { items: data, name: req.session.username })
            console.log('user', req.session.username);

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

app.get('/product', (req, res) => {
   res.render('product')
})

app.post('/product', (req, res) => {

   console.log(req.body)

   var product = Cakes(req.body).save((err, data) => {
      if (err) {
         throw err
      } else {
         console.log(data)
         res.redirect('product')

      }
   })

})

app.post('/login', (req, res) => {
   res.render('login')
})

app.listen(3000, () => {
   console.log('Server is running!');
});
