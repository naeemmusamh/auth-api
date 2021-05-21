'use strict';

//initialization and setup the app and packages
//base-64
const base64 = require('base-64');
//jsonwebtoken
const jwt = require('jsonwebtoken');
//bcrypt
const bcrypt = require('bcrypt');
//route for the dotenv
const SECRET = process.env.SECRET;
//route for the schema
const User = require('../models-auth/users-model.js');

module.exports = async(req, res, next) => {

    if (!req.headers.authorization) {
        next('Invalid username&password');
        return
    }
    let basic = req.headers.authorization.split(' ').pop();
    let [username, password] = base64.decode(basic).split(':');
    console.log(`username: ${username} password: ${password}`);
    const user = await User.findOne({ username: username });
    console.log("user -----> ", user);
    const valid = await bcrypt.compare(password, user.password);
    console.log("valid : ", valid);
    if (valid) {
        req.user = user;
        let token = jwt.sign({ username: user.username }, SECRET);
        console.log("token =====> ", token)
        req.token = token;
        next();
    } else {
        next('Wrong username or password');
    }

}