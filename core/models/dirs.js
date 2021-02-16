import mongoose from 'mongoose';

let dirsSchema = new mongoose.Schema({
    movies: {
        type: string[],
        required: [true, 'Please enter at least one path where movies are stored']
    },
    series: {
        type: string[],
        required: [true, 'Please enter at least one path where series are stored']
    }
});

module.exports = mongoose.model('Dirs', dirsSchema)
