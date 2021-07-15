const express = require('express');
const ampq = require('amqplib');
const morgan = require('morgan');
const server = express();
const PORT = 6002;

const {
    createPost,
    getPostById,
    editPostById,
    deletePostById,
} = require('./handlers/post.handerls.js');

server.use(morgan('common'));
server.use(express.json());

server.get('/api/posts/healthcheck', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date() / 1000,
    });
});

server.post('/api/posts/post/', createPost);

server.get('/api/posts/post/:id', getPostById);

server.patch('/api/posts/post/:id', editPostById);

server.delete('/api/posts/post/:id', deletePostById);

server.listen(PORT, () => {
    console.log(`Post service started at ${PORT}`);
});
