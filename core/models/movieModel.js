let mongoose = require("mongoose");

let movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name for the movie."],
    },
    path: {
        type: String,
        unique : true,
        required: [true, "Enter absolute path of the movie folder."],   
    },
    file: {
        type: String,
        required: [true, "Enter absolute path of the movie file."],   
    },
    length: {
        type: Number
    },
    year: {
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
    },
    subs: {
        type: []
    }
});

module.exports = mongoose.model("Movie", movieSchema)
