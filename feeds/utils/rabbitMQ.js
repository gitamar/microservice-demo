const MQ = require('amqplib');
const CONNECTION_URL = `amqp://host.minikube.internal:5001`;
const { onHandlePostCreated } = require('../consumers/post.consumer')
const { onHandleCommentCreated } = require('../consumers/comment.consumer')

let ch = null;

(async () => {
    let conn = await MQ.connect(CONNECTION_URL);
    let channel = await conn.createChannel();
    ch = channel;
    let que = await ch.consume('tasks', (msg) => {
        console.log(msg.content.toString());
        ch.ack(msg);
    });

    await ch.assertQueue('create-post');
    await ch.consume('create-post', (msg) => {  
        let data = msg.content.toString()
        console.log(`EVENT-RECIVED : Post Created ${data}`);
        onHandlePostCreated(JSON.parse(data))
        ch.ack(msg);
    });

    await ch.assertQueue('edit-post');
    await ch.consume('edit-post', (msg) => {
        console.log(`Post Edited ${msg.content.toString()}`);
        ch.ack(msg);
    });

    await ch.assertQueue('delete-post');
    await ch.consume('delete-post', (msg) => {
        console.log(`Post Deleted ${msg.content.toString()}`);
        ch.ack(msg);
    });

    await ch.assertQueue('create-comment');
    await ch.consume('create-comment', (msg) => {
        let data = msg.content.toString()
        console.log(`EVENT-RECIVED : Comment Created ${data}`);
        onHandleCommentCreated(JSON.parse(data))
        ch.ack(msg);
    });

    await ch.assertQueue('edit-comment');
    await ch.consume('edit-comment', (msg) => {
        console.log(`Comment Edited ${msg.content.toString()}`);
        ch.ack(msg);
    });

    await ch.assertQueue('delete-comment');
    await ch.consume('delete-comment', (msg) => {
        console.log(`Comment Deleted ${msg.content.toString()}`);
        ch.ack(msg);
    });
})();

const publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, Buffer.from(data));
};

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing All RabbitMQ channels.`);
});

module.exports = { publishToQueue };
