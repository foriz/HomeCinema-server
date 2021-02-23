let dirsModel = require('../models/dirsModel')

// Get a json array with all dirs for movies & series
exports.getAllDirs = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            res.json({
                "result": result
            });
        }
    });
};

// Get a json contains dirs only for movies
exports.getMoviesDirs = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            res.json({
                "result": result[0]['movies']
            });
        }
    });
};

// Add a new movie location in dirs['movies'] json
exports.addMovieLocation = function(req, res) {
    const locationToAdd = req.query.path

    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            if(result.length == 0) {
                // There is no record in db. Create a new one
                let init = new dirsModel({
                    movies: [locationToAdd],
                    series: []
                });  

                init.save()
                    .then(doc => {
                        console.log('New movies location added: \n'+doc);
                        res.json({
                            "success": "Movies locations updated!"
                        });
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err);
                        res.json({
                            "error": err
                        });
                    })
            }
            else {
                // Update existing record, if given path does not exists already
                const docId = result[0]['_id'];
                var moviesArr = result[0]['movies'];
                
                // Check if exists. If exists, do nothing
                if(moviesArr.indexOf(locationToAdd) > -1) {
                    res.json({
                        "success": "Movies locations are not updated, because location already exists!"
                    });
                }
                else {
                    moviesArr.push(locationToAdd);

                    dirsModel
                        .findOneAndUpdate( 
                            { 
                                _id: docId
                            }, 
                            { 
                                movies: moviesArr
                            },
                            {
                                new: true,
                                runValidators: true
                            })
                        .then(doc => {
                            console.log('Movies locations updated: \n'+doc)
                            res.json({
                                "success": "Movies locations updated!"
                            });
                        })
                        .catch(err => {
                            console.error('An error occured when inserting new locations: '+err)
                            res.json({
                                "error": err
                            });
                        })

                    res.json({
                        "success": "Movies locations updated!"
                    });
                }
            }
        }
    });
};

// Delete a new movie location in dirs['movies'] json
exports.deleteMovieLocation = function(req, res) {
    const locationToRemove = req.query.path

    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            // Check if record exists. If exists, remove it
            const docId = result[0]['_id'];
            var moviesArr = result[0]['movies'];

            // Check if exists. If exists, do nothing
            locationToRemoveIdx = moviesArr.indexOf(locationToRemove)
            if(locationToRemoveIdx > -1) {
                moviesArr.splice(locationToRemoveIdx, 1);

                dirsModel
                        .findOneAndUpdate( 
                            { 
                                _id: docId
                            }, 
                            { 
                                movies: moviesArr
                            },
                            {
                                new: true,
                                runValidators: true
                            })
                        .then(doc => {
                            console.log('Movies locations updated: \n'+doc)
                            res.json({
                                "success": "Movies locations updated!"
                            });
                        })
                        .catch(err => {
                            console.error('An error occured when inserting new locations: '+err)
                            res.json({
                                "error": err
                            });
                        })

                    res.json({
                        "success": "Movies locations updated!"
                    });
            }
            else {
                res.json({
                    "success": "Movies locations are not updated, because location does not exists!"
                });
            }
        }
    });
};

// Get a json contains dirs only for series
exports.getSeriesDirs = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            res.json({
                "result": result[0]['series']
            });
        }
    });
};

// Add a new series location in dirs['series'] json
exports.addSeriesLocation = function(req, res) {
    const locationToAdd = req.query.path

    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            if(result.length == 0) {
                // There is no record in db. Create a new one
                let init = new dirsModel({
                    movies: [],
                    series: [locationToAdd]
                });  

                init.save()
                    .then(doc => {
                        console.log('New series location added: \n'+doc);
                        res.json({
                            "success": "Series locations updated!"
                        });
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err);
                        res.json({
                            "error": err
                        });
                    })
            }
            else {
                // Update existing record, if given path does not exists already
                const docId = result[0]['_id'];
                var seriesArr = result[0]['series'];

                // Check if exists. If exists, do nothing
                if(seriesArr.indexOf(locationToAdd) > -1) {
                    res.json({
                        "success": "Series locations are not updated, because location already exists!"
                    });
                }
                else {
                    seriesArr.push(locationToAdd);

                    dirsModel
                        .findOneAndUpdate( 
                            { 
                                _id: docId
                            }, 
                            { 
                                series: seriesArr
                            },
                            {
                                new: true,
                                runValidators: true
                            })
                        .then(doc => {
                            console.log('Series locations updated: \n'+doc)
                            res.json({
                                "success": "Series locations updated!"
                            });
                        })
                        .catch(err => {
                            console.error('An error occured when inserting new locations: '+err)
                            res.json({
                                "error": err
                            });
                        })
                }
            }
        }
    });
};

// Delete a new series location in dirs['series'] json
exports.deleteSeriesLocation = function(req, res) {
    const locationToRemove = req.query.path

    res.setHeader('Content-Type', 'application/json');
    dirsModel.find({}, function(err, result) {
        if(err) {
            res.json({
                "error": err
            });
        }
        else {
            // Check if record exists. If exists, remove it
            const docId = result[0]['_id'];
            var seriesArr = result[0]['series'];

            // Check if exists. If exists, do nothing
            locationToRemoveIdx = seriesArr.indexOf(locationToRemove)
            if(locationToRemoveIdx > -1) {
                seriesArr.splice(locationToRemoveIdx, 1);

                dirsModel
                        .findOneAndUpdate( 
                            { 
                                _id: docId
                            }, 
                            { 
                                series: seriesArr
                            },
                            {
                                new: true,
                                runValidators: true
                            })
                        .then(doc => {
                            console.log('Series locations updated: \n'+doc)
                            res.json({
                                "success": "Series locations updated!"
                            });
                        })
                        .catch(err => {
                            console.error('An error occured when inserting new locations: '+err)
                            res.json({
                                "error": err
                            });
                        })

                    res.json({
                        "success": "Series locations updated!"
                    });
            }
            else {
                res.json({
                    "success": "Movies locations are not updated, because location does not exists!"
                });
            }
        }
    });
};