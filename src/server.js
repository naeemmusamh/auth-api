'use strict';

//initialization and setup the app and packages
//express
const express = require('express');
//cors
const cors = require('cors');
//morgan
const morgan = require('morgan');
//express app
const app = express();
//cors
app.use(cors());
//morgan
app.use(morgan('dev'));
// Process JSON input and output the data on req.body
app.use(express.json());
// Process FORM input and output the data on req.body
app.use(express.urlencoded({ extended: true }));

//middleware for the error page and router
//404 auth
const errorPath = require('./middleware-auth/404.js');
//500 auth
const errorhandler = require('./middleware-auth/500.js');
//404 api
const notFoundHandler = require('./middleware-api/404.js');
//500 api
const errorHandler = require('./middleware-api/500.js');
//router page
const user = require('./auth/router.js');
//router logger
const logger = require('./auth/middleware-api/logger.js');
//router api
const v1Router = require('./auth/v1.js');
//router api
const v2Router = require('./auth/v2.js');
//route for the router page
app.use(user);
//router for the logger page
app.use(logger);
//router fo the v1 api page
app.use('/api/v1', v1Router);
//router fo the v2 api page
app.use('/api/v2', v2Router);

//router for the home page
app.get('/', (req, res) => {
    res.status(200).send('welcome in the home page');
});

//router for the error handler
app.get('/not-found', (req, res) => {
    throw new Error('there is something wrong in your path');
});


//route for the Error pages
//404 auth
app.use('*', errorPath);
//500 auth
app.use(errorhandler);
//404 api
app.use('*', notFoundHandler);
//500 api
app.use(errorHandler);

//prepare the app for listen for the port
module.exports = {
    app: app,
    start: (port) => {
        app.listen(port, () => {
            console.log(`Server Up on ${port}`);
        });
    },
};