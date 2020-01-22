const express = require('express');
const server = express();

const router = require('./router.js');

server.use(express.json());
server.use("/api/posts", router);

server.get('/', (req, res) => {
    res.send(`Blog Post API Assignment`);
});

module.exports = server;