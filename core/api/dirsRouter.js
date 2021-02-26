var express = require("express");
var router = express.Router();

var dirsController = require("../controllers/dirsController")

// Dirs index route
router.get("/", dirsController.getAllDirs);

// Movies dirs routes
router.get("/movies", dirsController.getMoviesDirs);
router.patch("/movies/add", dirsController.addMovieLocation);
router.patch("/movies/delete", dirsController.deleteMovieLocation);

// Series dirs routes
router.get("/series", dirsController.getSeriesDirs);
router.patch("/series/add", dirsController.addSeriesLocation);
router.patch("/series/delete", dirsController.deleteSeriesLocation);

module.exports = router;