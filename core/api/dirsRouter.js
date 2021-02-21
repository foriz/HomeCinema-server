var express = require('express');
var router = express.Router();

var dirsController = require('../controllers/dirsController')

// Dirs index route
//router.get('/', dirsController.getAllDirs);

// Movies dirs routes
router.get('/movies', dirsController.getMoviesDirs);
router.get('/movies/add', dirsController.addMovieLocation);
router.get('/movies/delete', function() {});

// Series dirs routes
router.get('/series', dirsController.getSeriesDirs);
router.get('/series/add', dirsController.addSeriesLocation);
router.get('/series/delete', function() {});

module.exports = router;