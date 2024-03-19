require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")

// To mount the bodyParser middleware in root level which will be called for all routes
app.use((bodyParser.urlencoded({extended: false})) );

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl', function(req, res) {
  res.json({ original_url : 'https://freeCodeCamp.org', short_url : 1});
});

app.post('/api/shorturl', function(req, res) {
  let url = req.body.url
  res.json({ original_url : url, short_url : 123456});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
