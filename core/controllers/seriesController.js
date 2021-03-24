var fs = require("fs");

let seriesModel = require("../models/seriesModel")
let dbController = require("../controllers/mongoDbController")
let helpers = require("../utils/helpers")

// Get a list with all available movies in the Database
exports.listSeries = async function(req, res) {
    dbController.getAllCollection(seriesModel)
        .then((series) => {
            res.setHeader("Content-Type", "application/json");
            res.json( series );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Run again initialization process for series
exports.refreshSeries = async function(req, res) {
    // Delete existing collection of series
    dbController.deleteAllFromCollection(seriesModel)
        .then((deleteResult) => {
            // If collection deleted successfully
            console.log(deleteResult["deletedCount"] + " series deleted from database.");
            helpers.initializeSeriesOnly(dbController)
                .then((initResult) => {
                    // Return list of renewed series
                    dbController.getAllCollection(seriesModel)
                        .then((series) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json( series );
                        })
                        .catch((err) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json({ "error": err });
                        });
                })
                .catch((initError) => {
                    res.setHeader("Content-Type", "application/json");
                    res.json( initError );
                });
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get info about a specific series (name, no_seasons, no_episodes, year, description, tags, poster) (param: ser_id)
exports.getSeriesInfo = async function(req, res) {
    // Get series id parameter
    const seriesId = req.query.ser_id;
    dbController.getRecord(seriesModel, seriesId)
        .then((sInfo) => {
            res.setHeader("Content-Type", "application/json");
            res.json( sInfo );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};

// Get info about seasons of a series. For each season return given name and path
exports.getSeriesSeasons = async function(req, res) {
    // Get series id parameter
    const seriesId = req.query.ser_id;
    dbController.getRecord(seriesModel, seriesId)
        .then((sInfo) => {
            seasonsInfo = {}

            seriesPath = sInfo["path"];
            fs.readdirSync(seriesPath).forEach(folder => {
                if(fs.statSync(seriesPath + "\\" + folder).isDirectory()) {
                    if(folder.startsWith("Season")) {
                        seasonsInfo[folder] = seriesPath + "\\" + folder;
                    }
                }
            });

            res.setHeader("Content-Type", "application/json");
            res.json( seasonsInfo );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};

/********************************************************************************************************* */
/********************************************************************************************************* */
/********************************************************************************************************* */

// Get info about episoed of a season. For each episode return file name, length, path and subs (filename, path)
/*
exports.getSeasonEpisodes = async function(req, res) {
    // Get series id parameter
    const seriesId = req.query.ser_id;
    dbController.getRecord(seriesModel, seriesId)
        .then((sInfo) => {
            seasonsInfo = {}

            seriesPath = sInfo["path"];
            fs.readdirSync(seriesPath).forEach(folder => {
                if(fs.statSync(seriesPath + "\\" + folder).isDirectory()) {
                    if(folder.startsWith("Season")) {
                        seasonsInfo[folder] = seriesPath + "\\" + folder;
                    }
                }
            });

            res.setHeader("Content-Type", "application/json");
            res.json( seasonsInfo );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};
*/

/********************************************************************************************************* */
/********************************************************************************************************* */
/********************************************************************************************************* */

// Get info about available subs (param: movie_id)
/*
exports.getMovieSubs = async function(req, res) {
    const movId = req.query.mov_id;
    
    // Get movie info
    dbController.getRecord(seriesModel, movId)
        .then((mInfo) => {
            promises = [];
            mInfo["subs"].forEach((sub) => {
                promises.push(helpers.createSubBlob(sub))
            });     

            Promise.all(promises)
                .then((blobs) => {
                    res.setHeader("Content-Type", "application/json");
                    res.json( blobs );
                })
                .catch((err) => {
                    res.setHeader("Content-Type", "application/json");
                    res.json( err );
                });
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};
*/

// Stream movie (param: movie_id)
/*
exports.streamMovie = async function(req, res) {
    const movId = req.query["mov_id"];
    //const startByte = (req.headers["range"].replace("bytes=", "")).split("-")[0]

    dbController.getRecord(seriesModel, movId)
        .then((mInfo) => {
            //res.setHeader("Content-Type", "video/mp4");
            //fs.createReadStream(mInfo["file"], { start : startByte }).pipe(res);

            var buffer = fs.readFileSync(mInfo["file"]);

            res.setHeader("Content-Type", "video/mp4");
            res.write(buffer);
            res.end();
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        });
};
*/