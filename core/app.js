const express = require("express");
var app = express();

// Configuration files
const config = require("./config/config.json");
const server_ip = config["server"]["host"];
const server_port = config["server"]["port"];
const server_url = "http://" + server_ip + ":" + server_port;

// Initialize connection with MongoDB
const mongodb = require("./utils/mongodb.js");
// Helper functions
const helpers = require("./utils/helpers.js");

// Routers
var dirsRouter = require("./api/dirsRouter");
var moviesRouter = require("./api/moviesRouter");
var seriesRouter = require("./api/seriesRouter");

// Use routers
app.use("/dirs", dirsRouter);
app.use("/movies", moviesRouter);
app.use("/series", seriesRouter);

// Initialize/reload data in mongo database
const dbController = require("./controllers/mongoDbController.js");
helpers.initializeContent(dbController)
    .then((initResult) => {
        // Start server
        app.listen(server_port, () => {
            console.log("Started server ["+server_url+"]");
        });

        // API request for discovery connection & heartbeat
        app.get("/ping", (req, res, next) => {
            res.json({
              "response": "pong",
              "server_url": server_url,
              "protocol": "binary"
            });
        });
    })
    .catch((initError) => {
        console.error(initError);
    });