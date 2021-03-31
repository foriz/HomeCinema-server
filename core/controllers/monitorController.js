let monitorModel = require("../models/monitorModel");
let dbController = require("../controllers/mongoDbController");

// Get a json array with logs(all or filtered by timestamp)
exports.getLogs = async function(req, res) {
    /*
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            res.setHeader("Content-Type", "application/json");
            res.json( dirs );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
    */
};

// Get a json contains all notifications
exports.getNotifications = async function(req, res) {
    /*
    dbController.getSubCollection(dirsModel, "movies")
        .then((movies) => {
            res.setHeader("Content-Type", "application/json");
            res.json( movies ); 
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
    */
};

// Get a json contains all connections
exports.getResources = async function(req, res) {
    // TODO: Get monitor stats from Mongo (30 mins by default)
    // TODO: Implement time period params
    const returnAllParam = req.query.return_all;
    const startTimestampParam = req.query.start_timestamp;
    const endTimestampParam = req.query.end_timestamp;
    const intervalParam = req.query.time_interval;
    const nLogsParam = req.query.n_logs;
    
    if((returnAllParam == 'true') || (returnAllParam == 'True')) {
        // Return all saved monitoring stats.
        dbController.getAllCollection(monitorModel)
            .then((stats) => {
                res.setHeader("Content-Type", "application/json");
                res.json( stats );
            })
            .catch((err) => {
                res.setHeader("Content-Type", "application/json");
                res.json({ "error": err });
            });
    }
    else if(startTimestampParam != undefined) {
        if(endTimestampParam != undefined) {
            // Return for specific time window [start_timestamp, end_timestamp]
        }
        else if(intervalParam != undefined) {
            // Return for specific time window, with start paraman and time interval (in minutes) [start_timestamp, start_timestamp+interval].
        }
        else {
            // Return for specific time window, with start paraman and default time interval (30 minutes) [start_timestamp, start_timestamp+30mins].
        }
    }
    else if(nLogsParam != undefined) {
        // Return last n logs.
    }
    else {
        // Default. Reutn records for last 30 mins
    }
};

// Get a json contains all connections
exports.getConnections = async function(req, res) {
    sessions = []
    for (var sess in req.sessionStore.sessions) {
        sObj = {}
        sObj["session_id"] = sess;
        sObj["cookie"] = JSON.parse(req.sessionStore.sessions[sess])["cookie"];

        sessions.push(sObj);
    };

    res.setHeader("Content-Type", "application/json");
    res.json({ "sessions": sessions });
};