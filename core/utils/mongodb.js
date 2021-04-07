let mongoose = require("mongoose");
const config = require("../config/config.json")

let helpers = require("./helpers")

var logger = require("npmlog");
logger.on("log", function(l) {
    helpers.onLogCallback(l, "mongodb.js");
});

const server = config["mongodb"]["host"] + ":" + config["mongodb"]["port"]
const database = config["mongodb"]["db"];
const username = config["mongodb"]["username"];
const password = config["mongodb"]["password"];

class MongoDbConnection {
  constructor() {
    this._connect()
  }
  
  _connect() {
    if ((username.trim() == "") || (username.trim() == undefined)) {
      // If no username specified, try to connect without authentication
      logger.info("_connect", "Trying to connect without using authentication");

      mongoose.connect(`mongodb://${server}/${database}`, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
          logger.info("_connect", "Database connection successful");
        })
        .catch(err => {
          logger.error("_connect", err);
        })
    }
    else {
      // Try to connect using URI with authentication
      logger.info("_connect", "Trying to connect using username & password authentication");

      mongoose.connect(`mongodb://${username}:${password}@${server}/${database}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
          logger.info("_connect", "Database connection successful");
        })
        .catch(err => {
          logger.error("_connect", err);
        })
    }
  }
}

module.exports = new MongoDbConnection()