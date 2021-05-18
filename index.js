'use strict';

//initialization and setup the app and packages
//dotenv
require('dotenv').config();
//mongoose
const mongoose = require('mongoose');

// Start up DB Server
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URL, options);

// Start the web server
require('./src/server.js').start(process.env.PORT);