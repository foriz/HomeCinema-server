var express = require("express");
var router = express.Router();

var seriesController = require("../controllers/seriesController")

router.get("/list", seriesController.listSeries);
router.get("/refresh", seriesController.refreshSeries);
router.get("/info", seriesController.getSeriesInfo);
router.get("/seasons", seriesController.getSeriesSeasons);
router.get("/episodes", seriesController.getSeasonEpisodes);
router.get("/sub", seriesController.getSubtitle);
router.get("/stream", seriesController.streamEpisode);

module.exports = router;