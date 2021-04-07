const helpers = require("../utils/helpers.js");

let dirsModel = require("../models/dirsModel")
let dbController = require("../controllers/mongoDbController")

var logger = require('npmlog')
logger.on("log", function(l) {
    helpers.onLogCallback(l, "/dirs");
});

// Get a json array with all dirs for movies & series
exports.getAllDirs = async function(req, res) {
    logger.info("/", req.socket.remoteAddress);
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            res.setHeader("Content-Type", "application/json");
            res.json( dirs );
        })
        .catch((err) => {
            logger.error("/", err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get a json contains dirs only for movies
exports.getMoviesDirs = async function(req, res) {
    logger.info("/movies", req.socket.remoteAddress);
    dbController.getSubCollection(dirsModel, "movies")
        .then((movies) => {
            res.setHeader("Content-Type", "application/json");
            res.json( movies ); 
        })
        .catch((err) => {
            logger.error("/movies", err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Add a new movie location in dirs['movies'] json
exports.addMovieLocation = async function(req, res) {
    logger.info("/movies/add/path="+req.query.path, req.socket.remoteAddress);
    const locationToAdd = req.query.path;
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            if(dirs.length == 0) {
                // There is no record in db. Create a new one
                let newDirs = new dirsModel({
                    movies: [locationToAdd],
                    series: []
                });  
        
                dbController.insertRecord(newDirs)
                    .then((insertResult) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json( insertResult );
                    })
                    .catch((insertResultError) => {
                        logger.error("/movies/add/path="+req.query.path, insertResultError);
                        res.setHeader("Content-Type", "application/json");
                        res.json( insertResultError );
                    });
            }
            else {
                // Update existing record, if given path does not exists already
                const docId = dirs[0]["_id"];
                var moviesArr = dirs[0]["movies"];
                
                // Check if exists. If exists, do nothing
                if(moviesArr.indexOf(locationToAdd) > -1) {
                    res.setHeader("Content-Type", "application/json");
                    res.json({ "success": "Movies locations are not updated, because location already exists!" });
                }
                else {
                    moviesArr.push(locationToAdd);
                    dbController.updateRecord(dirsModel, docId, "movies", moviesArr)
                        .then((updateResult) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json( updateResult );
                        })
                        .catch((updateResultError) => {
                            logger.error("/movies/add/path="+req.query.path, updateResultError);
                            res.setHeader("Content-Type", "application/json");
                            res.json( updateResultError );
                        });
                }
            }
        })
        .catch((err) => {
            logger.error("/movies/add/path="+req.query.path, err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Delete a new movie location in dirs['movies'] json
exports.deleteMovieLocation = async function(req, res) {
    logger.info("/movies/delete/path="+req.query.path, req.socket.remoteAddress);
    const locationToRemove = req.query.path
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            // Check if record exists. If exists, remove it
            const docId = dirs[0]["_id"];
            var moviesArr = dirs[0]["movies"];

            locationToRemoveIdx = moviesArr.indexOf(locationToRemove)
            if(locationToRemoveIdx > -1) {
                moviesArr.splice(locationToRemoveIdx, 1);
                dbController.updateRecord(dirsModel, docId, "movies", moviesArr)
                    .then((deleteResult) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json( deleteResult );
                    })
                    .catch((deleteResultError) => {
                        logger.error("/movies/delete/path="+req.query.path, deleteResultError);
                        res.setHeader("Content-Type", "application/json");
                        res.json( deleteResultError );
                    });
            }
            else {
                res.setHeader("Content-Type", "application/json");
                res.json({ "success": "Movies locations are not updated, because location does not exists!" });
            }
        })
        .catch((err) => {
            logger.error("/movies/delete/path="+req.query.path, err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Get a json contains dirs only for series
exports.getSeriesDirs = async function(req, res) {
    logger.info("/series", req.socket.remoteAddress);
     dbController.getSubCollection(dirsModel, "series")
        .then((series) => {
            res.setHeader("Content-Type", "application/json");
            res.json( series );
        })
        .catch((err) => {
            logger.error("/series", err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Add a new series location in dirs['series'] json
exports.addSeriesLocation = async function(req, res) {
    logger.info("/series/add/path="+req.query.path, req.socket.remoteAddress);
    const locationToAdd = req.query.path;
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            if(dirs.length == 0) {
                // There is no record in db. Create a new one
                let newDirs = new dirsModel({
                    movies: [],
                    series: [locationToAdd]
                });  
        
                dbController.insertRecord(newDirs);
                dbController.insertRecord(newDirs)
                    .then((insertResult) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json( insertResult );
                    })
                    .catch((insertResultError) => {
                        logger.error("/series/add/path="+req.query.path, insertResultError);
                        res.setHeader("Content-Type", "application/json");
                        res.json( insertResultError );
                    });
            }
            else {
                // Update existing record, if given path does not exists already
                const docId = dirs[0]["_id"];
                var seriesArr = dirs[0]["series"];
                
                // Check if exists. If exists, do nothing
                if(seriesArr.indexOf(locationToAdd) > -1) {
                    res.setHeader("Content-Type", "application/json");
                    res.json({ "success": "Series locations are not updated, because location already exists!" });
                }
                else {
                    seriesArr.push(locationToAdd);
                    dbController.updateRecord(dirsModel, docId, "series", seriesArr)
                        .then((updateResult) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json( updateResult );
                        })
                        .catch((updateResultError) => {
                            logger.error("/series/add/path="+req.query.path, updateResultError);
                            res.setHeader("Content-Type", "application/json");
                            res.json( updateResultError );
                        });
                }
            }
        })
        .catch((err) => {
            logger.error("/series/add/path="+req.query.path, err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};

// Delete a new series location in dirs['series'] json
exports.deleteSeriesLocation = async function(req, res) {
    logger.info("/series/delete/path="+req.query.path, req.socket.remoteAddress);
    const locationToRemove = req.query.path
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            // Check if record exists. If exists, remove it
            const docId = dirs[0]["_id"];
            var seriesArr = dirs[0]["series"];

            locationToRemoveIdx = seriesArr.indexOf(locationToRemove)
            if(locationToRemoveIdx > -1) {
                seriesArr.splice(locationToRemoveIdx, 1);
                dbController.updateRecord(dirsModel, docId, "series", seriesArr)
                    .then((deleteResult) => {
                        res.setHeader("Content-Type", "application/json");
                        res.json( deleteResult );
                    })
                    .catch((deleteResultError) => {
                        logger.error("/series/delete/path="+req.query.path, deleteResultError);
                        res.setHeader("Content-Type", "application/json");
                        res.json( deleteResultError );
                    });
            }
            else {
                res.setHeader("Content-Type", "application/json");
                res.json({ "success": "Series locations are not updated, because location does not exists!" });
            }
        })
        .catch((err) => {
            logger.error("/series/delete/path="+req.query.path, err);
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
};