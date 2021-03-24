var express = require("express");
var router = express.Router();

var seriesController = require("../controllers/seriesController")

router.get("/list", seriesController.listSeries);
router.get("/refresh", seriesController.refreshSeries);
router.get("/info", seriesController.getSeriesInfo);
router.get("/seasons", seriesController.getSeriesSeasons);
router.get("/episodes", seriesController.getSeasonEpisodes);
/*
router.get("/subs", moviesController.getMovieSubs);
router.get("/stream", moviesController.streamMovie);
*/

module.exports = router;