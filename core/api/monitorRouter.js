var express = require("express");
var router = express.Router();

var monitorController = require("../controllers/monitorController");

router.get("/resources", monitorController.getResources);
router.get("/connections", monitorController.getConnections);
router.patch("/notifications", monitorController.getNotifications);
router.patch("/logs", monitorController.getLogs);

module.exports = router;