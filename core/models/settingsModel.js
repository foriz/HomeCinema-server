import mongoose from 'mongoose';

let settingsSchema = new mongoose.Schema({
    server: {
        type: string
    },
    protocol: {
        type: string,
        required: [true, 'Please enter default protocol for streaming.']
    },
});

module.exports = mongoose.model('Settings', settingsSchema);