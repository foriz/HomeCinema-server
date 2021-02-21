import mongoose from 'mongoose';

let notificationSchema = new mongoose.Schema({
    timestamp: {
        type: number,
        required: [true, 'Please enter timestamp of the notification.']
    },
    msg: {
        type: string
    },
});

module.exports = mongoose.model('Notification', notificationSchema);