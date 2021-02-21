import mongoose from 'mongoose';

let logSchema = new mongoose.Schema({
    timestamp: {
        type: number,
        required: [true, 'Please enter timestamp of the log creation.']
    },
    route: {
        type: string,
        required: [true, 'Please enter the API route, which logs.']
    },
    route: {
        type: string,
        required: [true, 'Please enter connection source for the log.']
    },
    msg: {
        type: string
    },
});

module.exports = mongoose.model('Log', logSchema);