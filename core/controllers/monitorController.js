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
    let startTimestampParam = parseInt(req.query.start_timestamp);
    let endTimestampParam = parseInt(req.query.end_timestamp);
    const intervalParam = Number(req.query.time_interval);
    const nLogsParam = parseInt(req.query.n_logs);

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
    else if(! isNaN(startTimestampParam)) {
        if(isNaN(endTimestampParam)) {
            // Return for specific time window [start_timestamp, end_timestamp]
            if(! isNaN(intervalParam)) {
                // Return for specific time window, with start paraman and time interval (in minutes) [start_timestamp, start_timestamp+interval].
                endTimestampParam = startTimestampParam + (intervalParam*60*1000)
            }
            else {
                // Return for specific time window, with start paraman and default time interval (30 minutes => 1800000) [start_timestamp, start_timestamp+30mins].
                endTimestampParam = startTimestampParam + (30*60*1000)    
            }
        }
        else {
            // Return for specific time window, with start paraman and default time interval (30 minutes => 1800000) [start_timestamp, start_timestamp+30mins].
            endTimestampParam = startTimestampParam + (30*60*1000)
        }

        var c1 = {};
        c1["field"] = "timestamp";
        c1["op"] = "gte";
        c1["value"] = startTimestampParam;

        var c2 = {};
        c2["field"] = "timestamp";
        c2["op"] = "lte";
        c2["value"] = endTimestampParam;

        var criteria = []
        criteria.push(c1);
        criteria.push(c2);

        dbController.filterRecords(monitorModel, criteria)
            .then((stats) => {
                res.setHeader("Content-Type", "application/json");
                res.json( stats );
            })
            .catch((err) => {
                res.setHeader("Content-Type", "application/json");
                res.json({ "error": err });
            });
    }
    else if(! isNaN(nLogsParam)) {
        // Return last n logs.
        dbController.getLastNRecords(monitorModel, nLogsParam, "timestamp", -1)
            .then((stats) => {
                res.setHeader("Content-Type", "application/json");
                res.json( stats );
            })
            .catch((err) => {
                res.setHeader("Content-Type", "application/json");
                res.json({ "error": err });
            });
    }
    else {
        // Default. Reutn records for last 30 mins
        startTimestampParam = +new Date - (30*60*1000)
        endTimestampParam = +new Date
        
        var c1 = {};
        c1["field"] = "timestamp";
        c1["op"] = "gte";
        c1["value"] = startTimestampParam;

        var c2 = {};
        c2["field"] = "timestamp";
        c2["op"] = "lte";
        c2["value"] = endTimestampParam;

        var criteria = []
        criteria.push(c1);
        criteria.push(c2);

        dbController.filterRecords(monitorModel, criteria)
            .then((stats) => {
                res.setHeader("Content-Type", "application/json");
                res.json( stats );
            })
            .catch((err) => {
                res.setHeader("Content-Type", "application/json");
                res.json({ "error": err });
            });
    }
};

// Get a json contains all connections
exports.getConnections = async function(req, res) {
    var sessions = []
    for (var sess in req.sessionStore.sessions) {
        var sObj = {}
        sObj["session_id"] = sess;
        sObj["cookie"] = JSON.parse(req.sessionStore.sessions[sess])["cookie"];

        sessions.push(sObj);
    };

    res.setHeader("Content-Type", "application/json");
    res.json({ "sessions": sessions });
};