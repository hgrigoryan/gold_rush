const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique : true, 
        required : true, 
        index: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        enum: ['fish', 'dolphin', 'whale'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;