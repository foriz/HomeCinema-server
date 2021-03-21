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

// Run again initialization process for movies
/*
exports.refreshMovies = async function(req, res) {
    // Delete existing collection of movies
    dbController.deleteAllFromCollection(seriesModel)
        .then((deleteResult) => {
            // If collection deleted successfully
            console.log(deleteResult["deletedCOunt"] + " movies deleted from database.");
            helpers.initializeMoviesOnly(dbController)
                .then((initResult) => {
                    // Return list of renewed movies
                    dbController.getAllCollection(seriesModel)
                        .then((movies) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json( movies );
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
*/

// Get info about a specific movie (name, length, year, description, tags, poster) (param: movie_id)
/*
exports.getMovieInfo = async function(req, res) {
    // Get movie id parameter
    const movId = req.query.mov_id;
    dbController.getRecord(seriesModel, movId)
        .then((mInfo) => {
            res.setHeader("Content-Type", "application/json");
            res.json( mInfo );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};
*/

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