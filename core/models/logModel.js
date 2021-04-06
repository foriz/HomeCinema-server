let mongoose = require("mongoose")

let logSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, "Please enter timestamp of the log creation."]
    },
    level: {
        type: String,
        required: [true, "Log level (info, warn, error)."]
    },
    prefix: {
        type: String,
        required: [true, "Please enter prefix of log."]
    },
    route: {
        type: String,
        required: [true, "Please enter the API route, which logs."]
    },
    msg: {
        type: String
    }
});

module.exports = mongoose.model("Log", logSchema, "logs");