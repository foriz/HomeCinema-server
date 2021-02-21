const express = require('express');
var app = express();

// Initialize connection with MongoDB
const mongodb = require('./utils/mongodb.js');

// Routers
var dirsRouter = require('./api/dirsRouter')

app.use('/dirs', dirsRouter)

// Start server
app.listen(3100, () => {

});

// API request for discovery connection & heartbeat
app.get("/ping", (req, res, next) => {
  res.json({
    "response": "pong"
  });
});
