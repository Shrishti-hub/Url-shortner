require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
//URL SHORTENING//
var ShortUrl = mongoose.model('ShortUrl',new mongoose.Schema({"name": String}))

app.use(bodyParser,urlencoded({extended:false}))
app.use(bodyParser.json())

app.post("/api/shorturl/new/",function(req,res){
  let client_requested_url = req.body.url
  let suffix = shortid.generate();

  res.json({
    "short_url":"",
    "original_url":"",
    "suffix":""
  })

})



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
