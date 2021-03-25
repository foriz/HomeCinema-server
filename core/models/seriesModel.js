let mongoose = require("mongoose");

let seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name for the series."],
    },
    path: {
        type: String,
        required: [true, "Enter location of the series."],   
    },
    seasons: {
        type: Number
    },
    episodes: {
        type: Number
    },
    description: {
        type: String
    },
    tags: {
        type: String
    },
    poster: {
        type: String
    }
});

module.exports = mongoose.model("Series", seriesSchema)