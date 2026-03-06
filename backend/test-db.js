const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Testing connection to mongodb://localhost:27017/examDB...');
        await mongoose.connect('mongodb://localhost:27017/examDB', { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB:', err.message);
        console.log('Attempting with 127.0.0.1...');
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/examDB', { serverSelectionTimeoutMS: 5000 });
            console.log('SUCCESS: Connected to MongoDB via 127.0.0.1');
            process.exit(0);
        } catch (err2) {
            console.error('FAILURE: Could not connect via 127.0.0.1 either:', err2.message);
            process.exit(1);
        }
    }
}

testConnection();
