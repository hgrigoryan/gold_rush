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
        max: 199
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
})

const Rank = mongoose.model("RewardsPerBucket", RankSchema);

module.exports = Rank;