let dbController = require("../controllers/mongoDbController")

// Get a json array with logs(all or filtered by timestamp)
exports.getLogs = async function(req, res) {
    /*
    dbController.getAllCollection(dirsModel)
        .then((dirs) => {
            res.setHeader("Content-Type", "application/json");
            res.json( dirs );
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
    */
};

// Get a json contains all notifications
exports.getNotifications = async function(req, res) {
    /*
    dbController.getSubCollection(dirsModel, "movies")
        .then((movies) => {
            res.setHeader("Content-Type", "application/json");
            res.json( movies ); 
        })
        .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.json({ "error": err });
        });
    */
};

// Get a json contains all connections
exports.getResources = async function(req, res) {
    // TODO: Get monitor stats from Mongo (30 mins by default)
    // TODO: Implement time period params
};

// Get a json contains all connections
exports.getConnections = async function(req, res) {
    sessions = []
    for (var sess in req.sessionStore.sessions) {
        sObj = {}
        sObj["session_id"] = sess;
        sObj["cookie"] = JSON.parse(req.sessionStore.sessions[sess])["cookie"];

        sessions.push(sObj);
    };

    res.setHeader("Content-Type", "application/json");
    res.json({ "sessions": sessions });
};