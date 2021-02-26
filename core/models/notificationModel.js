let mongoose = require("mongoose");

let notificationSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, "Please enter timestamp of the notification."]
    },
    msg: {
        type: String
    },
});

module.exports = mongoose.model("Notification", notificationSchema);