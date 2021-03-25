var fs = require("fs");

let movieModel = require("../models/movieModel")
let dbController = require("../controllers/mongoDbController")
let helpers = require("../utils/helpers")

// Get a list with all available movies in the Database
exports.listMovies = async function(req, res) {
    dbController.getAllCollection(movieModel)
        .then((movies) => {
            res.setHeader("Content-Type", "application/json");
            res.json( movies );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Run again initialization process for movies
exports.refreshMovies = async function(req, res) {
    // Delete existing collection of movies
    dbController.deleteAllFromCollection(movieModel)
        .then((deleteResult) => {
            // If collection deleted successfully
            console.log(deleteResult["deletedCount"] + " movies deleted from database.");
            helpers.initializeMoviesOnly(dbController)
                .then((initResult) => {
                    // Return list of renewed movies
                    dbController.getAllCollection(movieModel)
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

// Get info about a specific movie (name, length, year, description, tags, poster) (param: movie_id)
exports.getMovieInfo = async function(req, res) {
    // Get movie id parameter
    const movId = req.query.mov_id;
    dbController.getRecord(movieModel, movId)
        .then((mInfo) => {
            res.setHeader("Content-Type", "application/json");
            res.json( mInfo );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        })
};

// Get info about available subs (param: movie_id)
exports.getMovieSubs = async function(req, res) {
    const movId = req.query.mov_id;
    
    // Get movie info
    dbController.getRecord(movieModel, movId)
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

// Stream movie (param: movie_id)
exports.streamMovie = async function(req, res) {
    const movId = req.query["mov_id"];
    //const startByte = (req.headers["range"].replace("bytes=", "")).split("-")[0]

    dbController.getRecord(movieModel, movId)
        .then((mInfo) => {
            contentType = "video/mp4"
            if(path.extname(epFile) == ".mkv") {
                contentType = "video/mp4"
            }
            else if(path.extname(epFile) == ".avi"){
                contentType = "video/x-msvideo"
            }

            //res.setHeader("Content-Type", "video/mp4");
            //fs.createReadStream(mInfo["file"], { start : startByte }).pipe(res);

            var buffer = fs.readFileSync(mInfo["file"]);

            res.setHeader("Content-Type", contentType);
            res.write(buffer);
            res.end();
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json( err );
        });
};