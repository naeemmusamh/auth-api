'use strict';

const Users = require('../models/users-model.js');

module.exports = async(req, res, next) => {

    if (!req.headers.authorization) {
        next('Not Logged-in user');
    } else {
        try {
            let token = req.headers.authorization.split(' ').pop();
            let user = await Users.authenticateToken(token);
            console.log("from bearer user: ", user)
            if (user) {
                req.user = user;
                next();
            } else {
                next('Invalid Token!!!!');
            }
        } catch (e) {
            res.status(403).send('Invalid Token!!!!');

        }
    }
}