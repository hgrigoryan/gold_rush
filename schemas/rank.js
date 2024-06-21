const mongoose = require("mongoose");
const { Schema } = mongoose;

const RankSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    rank: {
        type: Number,
        min: 0,
        max: 199
    },
    claimComplete: {
        type: Boolean,
        default: false
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
})

const Rank = mongoose.model("Rank", RankSchema);

module.exports = Rank;