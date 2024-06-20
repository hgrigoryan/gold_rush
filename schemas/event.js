const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    state: {
        type: String,
        enum: ['started', 'ended'],
        default: 'started',
        index: true,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: function() {
            return new Date(this.startDate.getTime() + 300 * 1000); // 300 seconds after start
        }
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;