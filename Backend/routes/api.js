const Database = require("../database/Database");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokens = require("../tokens");
const multer = require('multer');
const assetsPath = `${__dirname}/../assets/`;
const upload = multer({ dest: assetsPath });
const fs = require('fs');

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
        const res = await db.select('Categories');

        response.status(200).json(res.rows);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/category/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const res = await db.select('Categories', [], [{ Id: id }]);

        response.status(200).json(res.rows[0]);
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

router.get('/products', async (request, response) => {
    const conditions = Object.keys(request.query).map(e => { const o = {}; o[e] = request.query[e]; return o; });

    try {
        const res = await db.select('Items', [], conditions);

        console.log(conditions);

        /*let sql = `SELECT * FROM Items`;

        if (conditions.length > 0) {
            sql += ' WHERE ';

            conditions.forEach(e => {
                Object.values(e)[0].split(",").forEach(el => {
                    sql += `${Object.keys(e)[0]}=${el} OR`
                });

                sql = sql.substring(0, sql.length - 2);

                sql += "AND ";
            });

            sql = sql.substring(0, sql.length - 4);
        }

        console.log(sql);*/

        //const sql = `SELECT * FROM Items WHERE`

        //const res = db.sendDBQuery()

        response.status(200).json(res.rows);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;