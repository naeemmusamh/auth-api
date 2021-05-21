'use strict';

//initialization and setup the app and packages
//dotenv
require('dotenv').config();
//mongoose
const mongoose = require('mongoose');

//route for the dotenv
//mongodb
const MONGODB_URL = process.env.MONGODB_URL;
//port
const PORT = process.env.PORT || 3030;

// Start up DB Server
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};
mongoose.connect(MONGODB_URL, options);

// Start the web server
require('./src/server.js').start(PORT);