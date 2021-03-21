var express = require("express");
var router = express.Router();

var seriesController = require("../controllers/seriesController")

router.get("/list", seriesController.listSeries);
/*
router.get("/refresh", moviesController.refreshMovies);
router.get("/info", moviesController.getMovieInfo);
router.get("/subs", moviesController.getMovieSubs);
router.get("/stream", moviesController.streamMovie);
*/

module.exports = router;