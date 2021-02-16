const express = require('express');
var app = express();

// Initialize connection with MongoDB
const mongodb = require('./utils/mongodb.js');

app.listen(3100, () => {

});

// API request for discovery connection & heartbeat
app.get("/ping", (req, res, next) => {
  res.json({
    "response": "pong"
  });
});