'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const acl = require('./middleware/oauth.js');

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

authRouter.post('/signin', basicAuth, (req, res, next) => {
    console.log(req.token);
    res.cookie('auth-token', req.token);
    res.set('auth-token', req.token);
    res.status(200).send(req.token);
});

authRouter.get('/users', bearerAuth, async(req, res, next) => {
    const users = await User.find({});
    const list = users.map(user => user.username);
    res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, acl("secret"), async(req, res, next) => {
    res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;