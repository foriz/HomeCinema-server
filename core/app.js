const express = require("express");
var app = express();

// Initialize connection with MongoDB
const mongodb = require("./utils/mongodb.js");
// Helper functions
const helpers = require("./utils/helpers.js");

// Routers
var dirsRouter = require("./api/dirsRouter");
var moviesRouter = require("./api/moviesRouter");

// Use routers
app.use("/dirs", dirsRouter);
app.use("/movies", moviesRouter);

// Initialize/reload data in mongo database
const dbController = require("./controllers/mongoDbController.js");
helpers.initializeContent(dbController)
    .then((initResult) => {
        // Start server
        app.listen(3100, () => {
            console.log("Started server");
        });

        // API request for discovery connection & heartbeat
        app.get("/ping", (req, res, next) => {
            res.json({
              "response": "pong"
            });
        });
    })
    .catch((initError) => {
        console.error(initError);
    });