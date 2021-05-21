'use strict';

//initialization and setup the app and packages
//express
const express = require('express');
//middleware for the router
const authRouter = express.Router();
//route for the schema page auth
const User = require('./models-auth/users-model.js');
//middleware for the basic auth page
const basicAuth = require('./middleware-auth/basic.js');
//middleware for the bearer auth page
const bearerAuth = require('./middleware-auth/bearer.js');
//middleware for the acl auth page
const acl = require('./middleware-auth/oauth.js');

//route for the sign in page you well use the postman app
authRouter.post('/signup', async(req, res, next) => {
    try {
        const user = new User(req.body);
        console.log("user >>> ", user);
        const record = await user.save();
        console.log("record : ", record)
        res.status(200).json(user);
    } catch (e) {
        console.log(e)
        res.status(403).send('Error Happened!');
    }
});

//route for the sign up page you will use postman app
authRouter.post('/signin', basicAuth, (req, res, next) => {
    console.log(req.token);
    res.cookie('auth-token', req.token);
    res.set('auth-token', req.token);
    res.status(200).send(req.token);
});

//route for the get all the info user you base for the sign in page in the postman app
authRouter.get('/users', bearerAuth, async(req, res, next) => {
    const users = await User.find({});
    const list = users.map(user => user.username);
    res.status(200).json(list);
});

//get the secret info users from the sign in page from the postman app
authRouter.get('/secret', bearerAuth, acl("secret"), async(req, res, next) => {
    res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;