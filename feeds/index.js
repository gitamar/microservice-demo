const express = require('express');
const morgan = require('morgan');
const server = express();
const { getFeed } = require('./handlers/feed.handlers');
const PORT = 6003;

server.use(express.json());
server.use(morgan('common'));

server.get('/healthcheck', (req, res) => {
    res.json({
        status: 'OK',
    });
});

server.get('/api/feed/me', getFeed);

server.listen(PORT, () => {
    console.log(`Feed service started at -> ${PORT}`);
});
