let mongoose = require("mongoose");

let settingsSchema = new mongoose.Schema({
    port: {
        type: Number,
        required: [true, "Please enter port, where server is listening."]
    },
    protocol: {
        type: String,
        required: [true, "Please enter default protocol for streaming."]
    }
});

module.exports = mongoose.model("Settings", settingsSchema, "settings");