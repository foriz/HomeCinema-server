let mongoose = require("mongoose")

let monitorSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, "Please enter timestamp of the log creation."]
    },
    os: {
        type: String,
        required: [true, "Info about running OS."]
    },
    sys_uptime: {
        type: Number,
        required: [true, "System uptime."]
    },
    process_uptime: {
        type: Number,
        required: [true, "Process uptime."]
    },
    cpu_count: {
        type: Number,
        required: [true, "Number of CPU's virtual cores."]
    }, 
    cpu_usage: {
        type: Number,
        required: [true, "Average usage of CPU (%)."]
    }, 
    mem_usage: {
        type: Number,
        required: [true, "Usage of RAM (%)."]
    },
    avg_load_1_min: {
        type: Number,
        required: [true, "Average load (1 minute)."]
    },
    avg_load_5_min: {
        type: Number,
        required: [true, "Average load (5 minutes)."]
    },
    avg_load_15_min: {
        type: Number,
        required: [true, "Average load (15 minutes)."]
    }
});

module.exports = mongoose.model("Monitor", monitorSchema, "monitor");