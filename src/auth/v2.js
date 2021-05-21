'use strict';

//initialization and setup the app and packages
//fs
const fs = require('fs');
//express
const express = require('express');
//route for class and create new collation schema
//schema
const Collection = require('../auth/models-api/data-collection.js');
//rote bearer
const bearerAuth = require('./middleware-auth/bearer.js');
//route acl
const aclAuth = require('./middleware-auth/oauth.js');
//middleware for the router
const router = express.Router();

const models = new Map();

router.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (models.has(modelName)) {
        req.model = models.get(modelName);
        next();
    } else {
        const fileName = `${__dirname}/./models-api/${modelName}/model.js`;
        if (fs.existsSync(fileName)) {
            const model = require(fileName);
            models.set(modelName, new Collection(model));
            req.model = models.get(modelName);
            next();
        } else {
            next("Invalid Model");
        }
    }
});

//router for create and get and update and delete the item for food and clothes
//to get all items
router.get('/:model', bearerAuth, handleGetAll);

async function handleGetAll(req, res) {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
}

//to get one item
router.get('/:model/:id', bearerAuth, handleGetOne);

async function handleGetOne(req, res) {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
}

//to create new item
router.post('/:model', bearerAuth, aclAuth('create'), handleCreate);

async function handleCreate(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
}

//to update one item and the last item add to the last
router.put('/:model/:id', bearerAuth, aclAuth('update'), handleUpdate);

async function handleUpdate(req, res) {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
}

//to delete one item and the last item add to the last
router.delete('/:model/:id', bearerAuth, aclAuth('delete'), handleDelete);

async function handleDelete(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
}


module.exports = router;