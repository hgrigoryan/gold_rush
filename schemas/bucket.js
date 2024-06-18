const mongoose = require("mongoose");
const { Schema } = mongoose;

const bucketSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
    usersData: {
        type: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              required: true,
              index: true
            },
            goldAmount: {
              type: Number,
              default: 0
            }
          }
        ],
        validate: {
          validator: function(val) {
            return val.length <= 200;
          },
          message: 'The users array exceeds the limit of 200.'
        }
      }
})

const Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = Bucket;