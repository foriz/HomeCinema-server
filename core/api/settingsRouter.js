var express = require("express");
var router = express.Router();

var settingsController = require("../controllers/settingsController");

router.get("/get", settingsController.getSettings);
router.patch("/update", settingsController.updateSettings);

module.exports = router;