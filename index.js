require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const dns = require("dns");
const urlParser = require("url");

// To mount the bodyParser middleware in root level which will be called for all routes
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// app.get("/api/shorturl", function (req, res) {
//   res.json({ original_url: "https://freeCodeCamp.org", short_url: 1 });
// });

let urlDatabase = {}; // This will act as a simple in-memory database

app.post("/api/shorturl", function (req, res) {
  let originalUrl = req.body.url;

  // Check if the URL is valid and starts with http:// or https://
  if (
    !validUrl.isUri(originalUrl) ||
    !(originalUrl.startsWith("http://") || originalUrl.startsWith("https://"))
  ) {
    return res.json({ error: "invalid url" });
  }

  // Check if the URL's host exists
  let urlObject = urlParser.parse(originalUrl);
  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    // Generate a short URL and store it in the database
    let shortUrl = Math.floor(Math.random() * 100000).toString();
    urlDatabase[shortUrl] = originalUrl;

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  let shortUrl = req.params.short_url;
  let originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
