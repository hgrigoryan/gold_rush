const mongoose = require("mongoose");
const { Schema } = mongoose;

const bucketSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    typesCount: {
      fish: {
        type: Number,
        min: 0,
        max: 150,
        default: 0
      },
      dolphin: {
        type: Number,
        min: 0,
        max: 40,
        default: 0
      },
      whale: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      }
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
            },
          }
        ],
        validate: {
          validator: function(val) {
            return val.length <= 200;
          },
          message: 'The users array exceeds the limit of 200.'
        }
      },
    cratedAt: {
      type: Date,
      default: Date.now
    },
})

const Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = Bucket;