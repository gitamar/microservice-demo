const express = require('express');
const ampq = require('amqplib');
const morgan = require('morgan');
const server = express();
const PORT = 6001;

const {
    createComment,
    getCommentByPost,
    getCommentById,
    editCommentById,
    deleteCommentById,
} = require('./handlers/comment.handerls');

server.use(morgan('common'));
server.use(express.json());

server.get('/api/comments/healthcheck', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date() / 1000,
    });
});


server.post('/api/comments/post/:postId', createComment);

server.get('/api/comments/post/:postId', getCommentByPost);

server.get('/api/comments/comment/:id', getCommentById);

server.patch('/api/comments/comment/:id', editCommentById);

server.delete('/api/comments/comment/:id', deleteCommentById);

server.listen(PORT, () => {
    console.log(`Comment service started at - ${PORT}`);
});
