const express = require('express')
const app = express();
const PORT = 3000;
const message = require("./lang/messages/en/user.js");
const utils = require('./modules/utils');
const fs = require('fs');
const path = require('path');


app.get('/COMP4537/labs/3/getDate/', (req, res) => {
    const username = req.query.name
    res.send(`<p style="color:blue">${message.greeting.replace("{0}", username).replace("{1}", utils.getDate())}</p>`);
})

app.get('/COMP4537/labs/3/writeFile/', (req, res) => {
    const filename = 'file.txt';
    const text = req.query.text;
    fs.appendFile(path.join(__dirname, filename), text, (err) => {
        if (err) {
            res.send(`<p style="color:red">${err}</p>`);
        } else {
            res.send(`<p style="color:blue">File written successfully</p>`);
        }
    });
})

app.get('/COMP4537/labs/3/readFile/', (req, res) => {
    const filename = req.query.file;
    fs.readFile(path.join(__dirname, filename), 'utf8', (err, data) => {
        if (err) {
            res.send(`<p style="color:red">${err}</p>`);
        } else {
            res.send(`<p style="color:blue">${data}</p>`);
        }
    });
})

app.listen(PORT, '0.0.0.0',() => {
    console.log('Running')
})