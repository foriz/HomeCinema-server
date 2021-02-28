var express = require("express");
var router = express.Router();

var moviesController = require("../controllers/moviesController")

router.get("/list", moviesController.listMovies);
router.get("/refresh", moviesController.refreshMovies);
router.get("/info", moviesController.getMovieInfo);
router.get("/subs", moviesController.getMovieSubs);
router.get("/stream", moviesController.streamMovie);

module.exports = router;