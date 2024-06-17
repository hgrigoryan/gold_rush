const mongoose = require("mongoose");
const { Schema } = mongoose;

const bucketSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
})

const Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = Bucket;