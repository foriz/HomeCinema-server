var fs = require("fs");
var path = require("path")

let dbController = require("../controllers/mongoDbController");
let settingsModel = require("../models/settingsModel");

let configuration = require("../config/config.json");

// Get a list with all available movies in the Database
exports.getSettings = async function(req, res) {
    dbController.getAllCollection(settingsModel)
        .then((settings) => {
            res.setHeader("Content-Type", "application/json");
            res.json( settings[0] );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get a list with all available movies in the Database
exports.updateSettings = async function(req, res) {
    let settingsRecord = {};

    dbController.getAllCollection(settingsModel)
        .then((settings) => {
            if(settings.length == 0) {
                // No current settings exists. Create new with default values.
                // As default port, use the port in configuration file.
                // As default protocol, use HTTP.
                settingsRecord["port"] = parseInt(configuration["server"]["port"]);
                settingsRecord["protocol"] = "HTTP";

                if("port" in req.query) {
                    // Server port will be changed
                    configuration["server"]["port"] = parseInt(req.query.port);
                    settingsRecord["port"] = parseInt(req.query.port);
                }
                if("protocol" in req.query) {
                    // Server protocol will be changed
                    settingsRecord["protocol"] = req.query.protocol;
                }

                dbController.insertRecord(settingsRecord)
                    .then((result) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json( result );
                    })
                    .catch((err) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json({ "error": err });
                    });
            }
            else {
                settingsRecord["port"] = settings[0]["port"];
                settingsRecord["protocol"] = settings[0]["protocol"];

                if("port" in req.query) {
                    // Server port will be changed
                    configuration["server"]["port"] = parseInt(req.query.port);
                    settingsRecord["port"] = parseInt(req.query.port);
                }
                if("protocol" in req.query) {
                    // Server protocol will be changed
                    settingsRecord["protocol"] = req.query.protocol;
                }

                fs.writeFileSync(process.cwd() + "/core/config/config.json", JSON.stringify(configuration, null, 4));
                
                dbController.updateSingleRecord(settingsModel, settings[0]["id"], settingsRecord)
                    .then((result) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json({ result });
                    })
                    .catch((error) => {
                        console.log(error)
                        res.setHeader("Content-Type", "application/json");
                        res.json({ "error": error });
                    });
            }
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};