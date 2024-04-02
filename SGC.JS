const express = require('express');
const fs = require('fs');
const admin = express();
const bodyParser = require('body-parser');

admin.use(bodyParser.urlencoded());

admin.get('/', (req, res, next) => {
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            data = 'No chat exists';
        }
        res.send(
            `${data}<form action="/" method="POST" onsubmit="document.getElementById('username').value = localStorage.getItem('username')">
            <input type="text" name="message" id="message">
            <input type="hidden" name="username" id="username">
            <br>
            <button type="submit">Send</button>
            </form>`
        );
    });
});

admin.post('/', (req, res) => {
    const username = req.body.username;
    const message = req.body.message;
    if (username && message) {
        fs.appendFile('messages.txt', `${username}: ${message}\n`, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal server error');
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.status(400).send('Invalid request');
    }
});

admin.get('/login', (req, res) => {
    res.send('<form onsubmit="localStorage.setItem(`username`, document.getElementById(`username`).value)" action="/login" method="POST"><input id="username" type="text" name="username" placeholder="Enter username"><button type="submit">Login</button></form>');
});

admin.post('/login', (req, res) => {
    const username = req.body.username;
    if (username) {
        res.setHeader('Set-Cookie', `username=${username}`);
        res.redirect('/');
    } else {
        res.status(400).send('Invalid username');
    }
});

admin.listen(4001);
