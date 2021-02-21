import mongoose from 'mongoose';

let seriesSchema = new mongoose.Schema({
    name: {
        type: string,
        required: [true, 'Please enter a name for the series.'],
    },
    path: {
        type: string,
        required: [true, 'Enter location of the series.'],   
    },
    seasons: {
        type: number
    },
    episodes: {
        type: number
    },
    description: {
        type: string
    },
    tags: {
        type: string
    }
});

module.exports = mongoose.model('Series', seriesSchema)