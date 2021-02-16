import mongoose from 'mongoose';

let movieSchema = new mongoose.Schema({
    name: {
        type: string,
        required: [true, 'Please enter a name for the movie.'],
    },
    path: {
        type: string,
        required: [true, 'Enter location of the movie.'],   
    },
    length: {
        type: number
    },
    description: {
        type: string
    },
    tags: {
        type: string
    }
});

module.exports = mongoose.model('Movie', movieSchema)