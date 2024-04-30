const mongoose = require('mongoose');
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to database");
    } catch (err) {
        console.error('Connection failed', err)
    }
}
module.exports = connectToDB;
