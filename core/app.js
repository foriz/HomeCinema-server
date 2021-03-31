const express = require("express");
const session = require('express-session')

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
var settingsRouter = require("./api/settingsRouter");
var monitorRouter = require("./api/monitorRouter");

var mongodbUrl = "mongodb://"+config["mongodb"]["username"]+":"+config["mongodb"]["password"]+"@"+config["mongodb"]["host"]+":"+config["mongodb"]["port"]+"/"+config["mongodb"]["db"]+"?authSource=admin"
if ((config["mongodb"]["username"].trim() == "") || (config["mongodb"]["username"].trim() == undefined)) {
    mongodbUrl = "mongodb://"+config["mongodb"]["host"]+":"+config["mongodb"]["port"]+"/"+config["mongodb"]["db"]
}

// Enable express session modue
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    })
)

// Use routers
app.use("/dirs", dirsRouter);
app.use("/movies", moviesRouter);
app.use("/series", seriesRouter);
app.use("/settings", settingsRouter);
app.use("/monitor", monitorRouter);

// Start monitoring
helpers.startMonitoring(10000);

// Initialize/reload data in mongo database
const dbController = require("./controllers/mongoDbController.js");
helpers.initializeContent(dbController, server_port)
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