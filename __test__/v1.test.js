'use strict';


require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js');
const responseTest = supergoose(server.app);
let id;

describe('V1 Api', () => {

    it('GET /food ', async() => {
        const response = await responseTest.get('/api/v1/food');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it('POST /food', async() => {
        const response = await responseTest.post('/api/v1/food').send({
            name: 'tomato',
            calories: '15',
            type: 'VEGETABLE',
        });

        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual('tomato');
        id = response.body._id;
    });

    it('GET /food/:id', async() => {
        const response = await responseTest.get(`/api/v1/food/${id}`);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('tomato');
    });

    it('GET /food', async() => {
        const response = await responseTest.get('/api/v1/food');
        expect(response.status).toEqual(200);
    });

    it('PUT /food', async() => {
        const response = await responseTest.put(`/api/v1/food/${id}`).send({
            name: 'banana',
            calories: '15',
            type: 'FRUIT',
        });
        expect(response.status).toEqual(200);
        expect(response.body.type).toEqual('FRUIT');
    });

    it('DELETE /food', async() => {
        const response = await responseTest.delete(`/api/v1/food/${id}`);
        expect(response.status).toEqual(200);
    });

    it('invalid model', async() => {
        const response = await responseTest.get('/api/v1/anyModels');
        expect(response.status).toEqual(500);
    });
});