const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const mongoose = require ('mongoose');

var app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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

var Cakes = mongoose.model('Cakes',cake)

app.get('/' ,(req,res) => {
   Cakes.find({}, (err,data) =>{
    if(err){
       throw err
    }else{
       res.render('index',{items:data})
       console.log({items:data});
       
    }
   })
});

app.listen(5000, ()=>{console.log('Server is running!');
});
