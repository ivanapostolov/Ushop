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

        console.log(res);

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

router.get('/filters/:categoryid', async (request, response) => {
    try {
        const id = request.params.categoryid;

        const descriptions = await db.select('description').from('Items').where({ CategoryId: id }).send();
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/product/:id', async (request, response) => {
    try {
        const item = await db.select('*').from('Items').where({ id: request.params.id }).send();

        response.status(200).json(item);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
})

router.post('/products', async (request, response) => {
    const filters = request.body;

    try {
        const items = await db.select('*').from('Items').send();

        const descriptions = items.map(e => e.description);

        let resIndex = items.map(e => true);

        for (const key in filters) {
            let i = 0;

            for (const value of descriptions) {
                if (!value[key].split(',').some(e => filters[key].includes(e))) {
                    resIndex[i] = false;
                }

                i++;
            }
        }

        const res = items.filter((e, i) => resIndex[i]);

        response.status(200).json(res);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;