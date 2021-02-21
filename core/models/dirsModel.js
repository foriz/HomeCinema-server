let mongoose = require('mongoose')

let dirsSchema = new mongoose.Schema({
    movies: {
        type: [String],
        required: [true, 'Please enter at least one path where movies are stored']
    },
    series: {
        type: [String],
        required: [true, 'Please enter at least one path where series are stored']
    }
});

module.exports = mongoose.model('Dirs', dirsSchema)
