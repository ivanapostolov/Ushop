const Database = require("../database/Database");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokens = require("../tokens");
const multer = require('multer');
const assetsPath = `${__dirname}/../assets/`;
const upload = multer({ dest: assetsPath });
const fs = require('fs');
const { response } = require("express");

const db = new Database();

const isUndefined = (value) => {
    return typeof value === 'undefined';
}

const deleteFile = (name) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`${assetsPath}${name}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ result: 'One file deleted from assets folder' })
            }
        });
    });
}

const renameFile = (name, newName) => {
    return new Promise((resolve, reject) => {
        fs.rename(`${assetsPath}${name}`, `${assetsPath}${newName}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ result: 'One file renamed in assets folder' })
            }
        });
    });
}

const authorize = (request, response, next) => {
    try {
        const token = request.body.token;

        if (token == null) {
            throw new Error("Token Not Provided");
        }

        jwt.verify(token, tokens.secrets.access, (error, user) => {
            if (error) {
                throw new Error("Invalid Token");
            } else {
                request.user = user;

                next();
            }
        });
    } catch (e) {
        request.error = e.message;

        next();
    }
}

router.get('/categories', async (request, response) => {
    try {
        const res = await db.select('*').from('Categories').send();

        response.status(200).json(res);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/category/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const res = await db.select('*').from('Categories').where({ Id: id }).send();

        response.status(200).json(res[0]);
    } catch (e) {
        console.error(e);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.post('/category', upload.single('img'), authorize, async (request, response) => {
    try {
        if (isUndefined(request.file)) {
            return response.status(400).send({ error: "Bad request" });
        }

        if (!isUndefined(request.error)) {
            deleteFile(request.file.filename)
            return response.status(400).send({ error: "Bad request" })
        }

        const name = request.body.name;

        if (request.user.email !== 'admin@admin.com' || isUndefined(name)) {
            deleteFile(request.file.filename);
            return response.status(401).send({ error: "Permission Denied" });
        }

        const res = await db.insert('Categories', [name]);

        await renameFile(request.file.filename, `category${res.rows[0].id}.png`);

        return response.status(200).json({ result: "Category inserted" });
    } catch (e) {
        console.error(e.message);

        return response.status(500).send({ error: "Internal server error" });
    }
});

router.get('/products/:filters', async (request, response) => {
    try {
        const decodedFilters = JSON.parse(Buffer.from(request.params.filters, 'base64').toString());

        const { categoryId, filters } = decodedFilters;

        let condition = {};

        for (const key in filters) {
            if (key === 'size' || key === 'color') {
                condition[`${key}`] = filters[key];
            } else {
                condition[`description ->> '${key}'`] = filters[key];
            }
        }

        //const items = await db.select('*').from('Items FULL JOIN ItemVariations ON Items.id = ItemVariations.ItemId');

        if (!isUndefined(filters.size) || !isUndefined(filters.color)) {
            db.select('*').from('Items FULL JOIN ItemVariations ON Items.id = ItemVariations.ItemId');
        } else {
            db.select('*').from("Items");
        }

        let items = await db.where({ CategoryId: categoryId }).where_in(condition).send();

        //const ids = items.map(e => e.id).reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);

        items = await db.select('*').from("Items").where_in({ Id: [...new Set(items.map(e => e.id))] }).send();

        response.status(200).json(items);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/product/:id', async (request, response) => {
    try {
        let item = await db.select('*').from('Items').where({ id: request.params.id }).send();

        item[0].size = (await db.select('size').distinct().from('ItemVariations').where({ ItemId: request.params.id }).send()).map(e => e.size);
        item[0].color = (await db.select('color').distinct().from('ItemVariations').where({ ItemId: request.params.id }).send()).map(e => e.color);
        response.status(200).json(item);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/filters/:categoryid', async (request, response) => {
    try {
        const id = request.params.categoryid;

        const descriptions = (await db.select('description').from('Items').where({ CategoryId: id }).send()).map(e => e.description);

        let keys = [];

        descriptions.forEach(e => keys.push(...Object.keys(e).filter(k => !keys.includes(k))));

        let filters = {};

        for (const key of keys) {
            filters[key] = (await db.select(`description ->> '${key}'`).as(key).distinct().from('Items').where({ CategoryId: id }).send()).map(e => e[key]).filter(e => e !== null);
        }

        filters.size = (await db.select('size').distinct().from('ItemVariations INNER JOIN Items ON ItemVariations.ItemId = Items.Id').where({ CategoryId: id }).send()).map(e => e.size)
        filters.color = (await db.select('color').distinct().from('ItemVariations INNER JOIN Items ON ItemVariations.ItemId = Items.Id').where({ CategoryId: id }).send()).map(e => e.color)

        if (filters.size.length === 0) {
            delete filters.size;
        }

        if (filters.color.length === 0) {
            delete filters.color;
        }

        response.status(200).json(filters);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;