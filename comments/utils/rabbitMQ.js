const MQ = require('amqplib');
const CONNECTION_URL = `amqp://host.minikube.internal:5001`;

let ch = null;

(async () => {
    let conn = await MQ.connect(CONNECTION_URL);
    let channel = await conn.createChannel();
    ch = channel;
    await ch.assertQueue('tasks')
    let que = await ch.consume('tasks', (msg) => {
        console.log(msg.content.toString());
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
