const { model } = require('mongoose');
const connectToDB = require('./config/db');
require('dotenv').config();
const { userData, AuthorData, bookData } = require('./generateData');
const { Author } = require('./models/Author');
const { User } = require('./models/User');
const { Book } = require('./models/Book');

connectToDB();

const insert = async (modelName, data) => {
    try {
        const Model = model(modelName); // Fetch the model dynamically
        await Model.insertMany(data);
        console.log('Data inserted');
    } catch (err) {
        console.log("Error in insert", err);
        process.exit(1);
    }

    console.log('Exit');
    process.exit();
}

const deletex = async (modelName, data) => {
    try {
        const Model = model(modelName); // Fetch the model dynamically
        await Model.deleteMany(data);
        console.log('Data deleted');
    } catch (err) {
        console.log("Error in delete", err);
        process.exit(1);
    }
    console.log('Exit');
    process.exit();
}

if (process.argv[2] === '--insert') {
    const modelName = process.argv[3];
    let sec;
    if (modelName === 'User') sec = userData();
    if (modelName === 'Author') sec = AuthorData();
    if (modelName === 'Book') sec = bookData();
    console.log(sec);
    insert(modelName, sec);
}

if (process.argv[2] === '--delete') {
    const modelName = process.argv[3];
    deletex(modelName, {});
}
