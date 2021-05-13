require('dotenv').config();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var dns = require('dns');
var urlparser = require('url');
var express = require('express');
var cors = require('cors');
var app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
//URL SHORTENING//
var ShortUrl = mongoose.model('ShortUrl',new mongoose.Schema({
  short_url : String,
  original_url : String,
  suffix : String
}))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

let suffix = shortid.generate();

app.post("/api/shorturl",function(req,res){
  console.log("post req called");
  console.log(req.body.url+"req body");

  let newURL = new ShortUrl({
    "short_url" : __dirname + "/api/shorturl/" + suffix,
    "original_url" : req.body.url,
    "suffix" : suffix
  })
  const bodyurl = req.body.url ; 
  const something = dns.lookup(urlparser.parse(bodyurl).hostname,(error,address)=>{
    if(!address){
      res.json({error:"Invalid URL"})
    }else{
      newURL.save(function(err,doc){
        if(err){
          console.log(err);
        }
        res.json({
          "short_url":newURL.short_url,
          "original_url":newURL.original_url,
          "suffix":newURL.suffix
        });
      });
    }
  })
  
})
app.get("/api/shorturl/:suffix",function(req,res){
  let userGeneratedSuffix = req.params.suffix;
  ShortUrl.findById({userGeneratedSuffix},(err,data)=>{
    console.log(data.original_url);
    if(!data){
      res.json({
        error : "Invalid URL"
      })
    }else{
      res.redirect(data.original_url);
    }
  })
});
    
//     let userRedirect = foundUrl[0];
//     // console.log(userRedirect);
//     res.redirect(userRedirect.original_url);
//   })
// })


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
