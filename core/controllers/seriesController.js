var fs = require("fs");
var path = require("path")

let seriesModel = require("../models/seriesModel")
let dbController = require("../controllers/mongoDbController")
let helpers = require("../utils/helpers")

var logger = require('npmlog')
logger.on("log", function(l) {
    helpers.onLogCallback(l, "/series");
});

// Get a list with all available movies in the Database
exports.listSeries = async function(req, res) {
    logger.info("/list", req.socket.remoteAddress);
    dbController.getAllCollection(seriesModel)
        .then((series) => {
            res.setHeader("Content-Type", "application/json");
            res.json( series );
        })
        .catch((err) => {
            logger.error("/list", err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Run again initialization process for series
exports.refreshSeries = async function(req, res) {
    logger.info("/refresh", req.socket.remoteAddress);
    // Delete existing collection of series
    dbController.deleteAllFromCollection(seriesModel)
        .then((deleteResult) => {
            // If collection deleted successfully
            logger.info("/refresh", deleteResult["deletedCount"] + " series deleted from database.");
            helpers.initializeSeriesOnly(dbController)
                .then((initResult) => {
                    // Return list of renewed series
                    dbController.getAllCollection(seriesModel)
                        .then((series) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json( series );
                        })
                        .catch((err) => {
                            logger.error("/refresh", err);
                            res.setHeader("Content-Type", "application/json");
                            res.json({ "error": err });
                        });
                })
                .catch((initError) => {
                    logger.error("/refresh", initError);
                    res.setHeader("Content-Type", "application/json");
                    res.json( initError );
                });
        })
        .catch((err) => {
            logger.error("/refresh", err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get info about a specific series (name, no_seasons, no_episodes, year, description, tags, poster) (param: ser_id)
exports.getSeriesInfo = async function(req, res) {
    logger.info("/info/"+req.query.ser_id, req.socket.remoteAddress);
    // Get series id parameter
    const seriesId = req.query.ser_id;
    dbController.getRecord(seriesModel, seriesId)
        .then((sInfo) => {
            res.setHeader("Content-Type", "application/json");
            res.json( sInfo );
        })
        .catch((err) => {
            logger.error("/info/"+req.query.ser_id, err);
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};

// Get info about seasons of a series. For each season return an id (counter), given name and path
exports.getSeriesSeasons = async function(req, res) {
    logger.info("/seasons/"+req.query.ser_id, req.socket.remoteAddress);

    // Get series id parameter
    const seriesId = req.query.ser_id;
    dbController.getRecord(seriesModel, seriesId)
        .then((sInfo) => {
            seasonsCounter = 1;
            seasonsInfo = {};

            seriesPath = sInfo["path"];
            fs.readdirSync(seriesPath).forEach(folder => {
                if(fs.statSync(seriesPath + "/" + folder).isDirectory()) {
                    if(folder.startsWith("Season")) {
                        sObj = {};
                        sObj["name"] = folder;
                        sObj["path"] = seriesPath + "/" + folder;
                        sObj["id"] = seasonsCounter;

                        seasonsInfo[seasonsCounter] = sObj;
                        seasonsCounter = seasonsCounter + 1
                    }
                }
            });

            res.setHeader("Content-Type", "application/json");
            res.json( seasonsInfo );
        })
        .catch((err) => {
            logger.error("/seasons/"+req.query.ser_id, err);

            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};

// Get info about episoed of a season. For each episode return file name, length, path and subs (filename, path)
exports.getSeasonEpisodes = async function(req, res) {
    logger.info("/episodes/"+req.query.season_path, req.socket.remoteAddress);

    // Get series id parameter
    var seasonPath = req.query.season_path;

    episodes = {}
    episodesCounter = 1
    fs.readdirSync(seasonPath).forEach(episode => {
        // Check if video file (accepted extensions: .mp4, .mkv, .avi)
        if(path.extname(episode) == ".avi" || path.extname(episode) == ".mp4" || path.extname(episode) == ".mkv") {
            subsFile = path.parse(episode).name + ".srt"
            subs = []

            // Search for subs for this episode. Subs can be detected if they are in same location with
            // video file having exact the same name and .srt extension. Or if they are in a Subs folder
            // having exact the same name with video file and .srt extension.
            if (fs.existsSync(seasonPath + "/" + subsFile)) {
                subsObj = {}
                subsObj["filename"] = subsFile;
                subsObj["path"] = seasonPath + "/" + subsFile
                
                subs.push(subsObj);
            }

            if (fs.existsSync(seasonPath + "/Subs/" + subsFile)) {
                subsObj = {}
                subsObj["filename"] = subsFile;
                subsObj["path"] = seasonPath + "/Subs/" + subsFile
                
                subs.push(subsObj);
            }

            eObj = {};
            eObj["name"] = episode;
            eObj["path"] = seasonPath + "/" + episode;
            eObj["id"] = episodesCounter;
            eObj["subs"] = subsObj;

            episodes[episodesCounter] = eObj;
            episodesCounter = episodesCounter + 1
        }
    });

    res.setHeader("Content-Type", "application/json");
    res.json( episodes );
};

// Get info about specific subtitles file (param: sub)
exports.getSubtitle = async function(req, res) {
    logger.info("/sub/path="+req.query.path+"&filename="+req.query.filename, req.socket.remoteAddress);

    const subPath = req.query.path;
    const subFilename = req.query.filename;

    sub = {}
    sub["path"] = subPath;
    sub["filename"] = subFilename;

    helpers.createSubBlob(sub)
        .then((subObj) => {
            res.setHeader("Content-Type", "application/json");
            res.json( subObj );
        })
        .catch((err) => {
            logger.error("/sub/path="+req.query.path+"&filename="+req.query.filename, err);
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        });
};

// Stream episode. As param given the path of the episode video file (param: path)
exports.streamEpisode = async function(req, res) {
    logger.info("/stream/"+req.query["path"], req.socket.remoteAddress);

    const epFile = req.query["path"];

    contentType = "video/mp4"
    if(path.extname(epFile) == ".mkv") {
        contentType = "video/mp4"
    }
    else if(path.extname(epFile) == ".avi"){
        contentType = "video/x-msvideo"
    }

    //const startByte = (req.headers["range"].replace("bytes=", "")).split("-")[0]

    //res.setHeader("Content-Type", "video/mp4");
    //fs.createReadStream(mInfo["file"], { start : startByte }).pipe(res);

    var buffer = fs.readFileSync(epFile);

    res.setHeader("Content-Type", contentType);
    res.write(buffer);
    res.end();
};