const express = require('express');
var app = express();

app.listen(3100, () => {

});

// API request for discovery connection & heartbeat
app.get("/ping", (req, res, next) => {
  res.json({
    "response": "pong"
  });
});