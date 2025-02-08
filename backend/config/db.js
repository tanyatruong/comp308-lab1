const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully");

        // Drop the old index if it exists to allow duplicate course codes (this allow creating course with different sections)
        try {
            const collection = mongoose.connection.collection('courses');
            const indexes = await collection.indexes();

            if (indexes.some(index => index.name === 'courseCode_1')) {
                await collection.dropIndex('courseCode_1');
                console.log('Dropped old index courseCode_1');
            } else {
                console.log('No old index to drop');
            }
        } catch (indexErr) {
            console.error('Error dropping old index:', indexErr.message);
        }

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
