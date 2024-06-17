const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    state: {
        type: String,
        enum: ['started', 'ended'],
        default: 'started',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;