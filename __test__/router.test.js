'use strict';

require('dotenv').config();
const SECRET = process.env.SECRET;

const server = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server.app);

let users = {
    admin: { username: 'admin', password: 'password' },
    editor: { username: 'editor', password: 'password' },
    user: { username: 'user', password: 'password' },
};

describe('Auth Router', () => {

    Object.keys(users).forEach(userType => {

        describe(`${userType} users`, () => {

            it('can create one', async() => {
                const response = await mockRequest.post('/signup').send(users[userType]);
                const userObject = response.body;
                expect(response.status).toBe(200);
            });

            it('can signin with basic', async() => {
                const response = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const userObject = response.body;
                expect(response.status).toBe(200);
            });

            it('can signin with bearer', async() => {
                // First, use basic to login to get a token
                const response = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = response.body.token;
                // First, use basic to login to get a token
                const bearerResponse = await mockRequest.get('/secret').set('Authorization', `Bearer ${token}`);
                // Not checking the value of the response, only that we "got in"
                expect(bearerResponse.status).toBe(403);
            });

        });

        describe('bad logins', () => {
            it('basic fails with known user and wrong password ', async() => {
                const response = await mockRequest.post('/signin').auth('admin', 'xyz');
                const userObject = response.body;
                expect(response.status).toBe(500);
                expect(userObject.user).not.toBeDefined();
                expect(userObject.token).not.toBeDefined();

            });

            it('bearer fails with an invalid token', async() => {
                // First, use basic to login to get a token
                const bearerResponse = await mockRequest.get('/users').set('Authorization', `Bearer foobar`);
                // Not checking the value of the response, only that we "got in"
                expect(bearerResponse.status).toBe(403);

            });
        });

    });

});