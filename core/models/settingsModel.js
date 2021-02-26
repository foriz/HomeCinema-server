let mongoose = require("mongoose");

let settingsSchema = new mongoose.Schema({
    server: {
        type: String
    },
    protocol: {
        type: String,
        required: [true, "Please enter default protocol for streaming."]
    },
});

module.exports = mongoose.model("Settings", settingsSchema);