const express = require('express');
const connectToDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(require('./middlewares/logger'))
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: false }));
connectToDB()

// Routes
app.use('/book', require('./routes/books'));
app.use('/author', require('./routes/authors'));
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/upload', require('./routes/upload'))
app.use('/forgot-password', require('./routes/password'))


// Root route
app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
