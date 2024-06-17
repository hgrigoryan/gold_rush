const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        const mongoURI = 'mongodb://localhost:27017/goldRush';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToDB;