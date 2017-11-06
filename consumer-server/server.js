const logger = require('./logger.js');

const Kafka = require('kafka-node');
const Consumer = Kafka.Consumer;
const Client = Kafka.Client;

const myClient = new Client('localhost:2181');

myClient.once('connect', () => {
  myClient.loadMetadataForTopics([], (err, results) => {
    const metadata = results[1].metadata; // Usually the second one is the metadata about topics
    logger.loginfo(`Available Kafka topics: [${Object.keys(metadata)}]`);
  });
});

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);

app.use(express.static('public'));
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});

const io = require('socket.io')(httpServer);

const KafkaClients = {};

io.on('connection', (client) => {
  logger.loginfo(`Client ${client.id} is connected.`);

  io.emit('message', "Welcome to Consumer Server!!!");

  KafkaClients[client.id] = new Client('localhost:2181', client.id);

  const payloads = [
    { topic: 'message', partition: 0},
    { topic: 'message', partition: 1},
    { topic: 'message', partition: 2}
  ];

  const options = { autoCommit: false };

  const consumer = new Consumer(KafkaClients[client.id], payloads, options);

  consumer.on('message', function (message) {
    console.log(message);
  });
});


httpServer.listen(3000, () => {
  logger.loginfo("HTTP server is serving and listening on 3000");
});
