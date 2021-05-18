'use strict';

const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET || 'mysecret';
const User = require('../models/users-model.js');

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