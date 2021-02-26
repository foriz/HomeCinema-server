let mongoose = require("mongoose")

let logSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, "Please enter timestamp of the log creation."]
    },
    route: {
        type: String,
        required: [true, "Please enter the API route, which logs."]
    },
    source: {
        type: String,
        required: [true, "Please enter connection source for the log."]
    },
    msg: {
        type: String
    },
});

module.exports = mongoose.model("Log", logSchema);