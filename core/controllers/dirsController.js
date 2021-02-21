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
    // TODO: get location as parameter
    const locationToAdd = 'test_loca';

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
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err);
                    })
            }
            else {
                // Update existing record
                const docId = result[0]['_id'];
                var moviesArr = result[0]['movies'];
                
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
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err)
                    })
            }
        }
    });
};

// Delete a new movie location in dirs['movies'] json
exports.deleteMovieLocation = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    // TODO:
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
    // TODO: get location as parameter
    const locationToAdd = 'test_loca';

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
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err);
                    })
            }
            else {
                // Update existing record
                const docId = result[0]['_id'];
                var seriesArr = result[0]['series'];
                
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
                    })
                    .catch(err => {
                        console.error('An error occured when inserting new locations: '+err)
                    })
            }
        }
    });
};

// Delete a new series location in dirs['series'] json
exports.deleteSeriesLocation = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    // TODO:
};