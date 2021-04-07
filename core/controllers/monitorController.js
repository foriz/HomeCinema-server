const helpers = require("../utils/helpers.js");

let monitorModel = require("../models/monitorModel");
let logModel = require("../models/logModel");
let dbController = require("../controllers/mongoDbController");

var logger = require('npmlog')
logger.on("log", function(l) {
    helpers.onLogCallback(l, "/monitor");
});


// Get a json array with logs(all or filtered by timestamp)
exports.getLogs = async function(req, res) {
    logger.info("/logs/level_logs="+req.query.level_logs+"&n_logs="+req.query.n_logs, req.socket.remoteAddress);
    
    var logLevelParam = req.query.level_logs;
    var nLogsParam = parseInt(req.query.n_logs);
    
    if(logLevelParam == undefined) {
        logLevelParam = "error";
    }
    if(isNaN(nLogsParam)) {
        nLogsParam = 10;
    }

    var c = {};
    c["field"] = "level";
    c["op"] = "eq";
    c["value"] = logLevelParam;
    
    var criteria = []
    criteria.push(c);

    dbController.filterLastNRecords(logModel, criteria, nLogsParam, "timestamp", -1)
        .then((dirs) => {
            res.setHeader("Content-Type", "application/json");
            res.json( dirs );
        })
        .catch((err) => {
            logger.error("/logs/level_logs="+req.query.level_logs+"&n_logs="+req.query.n_logs, err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get a json contains all connections
exports.getResources = async function(req, res) {
    const returnAllParam = req.query.return_all;
    let startTimestampParam = parseInt(req.query.start_timestamp);
    let endTimestampParam = parseInt(req.query.end_timestamp);
    const intervalParam = Number(req.query.time_interval);
    const nLogsParam = parseInt(req.query.n_logs);

    logger.info("/resources/return_all="+returnAllParam+"&start_timestamp="+startTimestampParam 
        +"&end_timestamp="+endTimestampParam+"&time_interval="+intervalParam+"&n_logs="+nLogsParam, req.socket.remoteAddress);

    if((returnAllParam == 'true') || (returnAllParam == 'True')) {
        // Return all saved monitoring stats.
        dbController.getAllCollection(monitorModel)
            .then((stats) => {
                res.setHeader("Content-Type", "application/json");
                res.json( stats );
            })
            .catch((err) => {
                logger.error("/resources/return_all="+returnAllParam+"&start_timestamp="+startTimestampParam 
                    +"&end_timestamp="+endTimestampParam+"&time_interval="+intervalParam+"&n_logs="+nLogsParam, err);
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
                logger.error("/resources/return_all="+returnAllParam+"&start_timestamp="+startTimestampParam 
                    +"&end_timestamp="+endTimestampParam+"&time_interval="+intervalParam+"&n_logs="+nLogsParam, err);
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
                logger.error("/resources/return_all="+returnAllParam+"&start_timestamp="+startTimestampParam 
                    +"&end_timestamp="+endTimestampParam+"&time_interval="+intervalParam+"&n_logs="+nLogsParam, err);
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
                logger.error("/resources/return_all="+returnAllParam+"&start_timestamp="+startTimestampParam 
                    +"&end_timestamp="+endTimestampParam+"&time_interval="+intervalParam+"&n_logs="+nLogsParam, err);
                res.setHeader("Content-Type", "application/json");
                res.json({ "error": err });
            });
    }
};

// Get a json contains all connections
exports.getConnections = async function(req, res) {
    logger.info("/connections", req.socket.remoteAddress);
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