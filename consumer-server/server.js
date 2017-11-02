const logger = require('./logger.js');

const Kafka = require('kafka-node');
const Consumer = Kafka.Consumer;
const Client = Kafka.Client;

const myClient = new Client('localhost:2181');

myClient.once('connect', () => {
  myClient.loadMetadataForTopics([], (err, results) => {
    const metadata = results[1].metadata; // Usually the second one is the metadata about topics
    logger.loginfo(`Available Kafka topics: [${Object.keys(metadata)}]`);
  })
});

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);

app.use(express.static('public'))
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});

const io = require('socket.io')(httpServer);

io.on('connection', (client) => {
  logger.loginfo(`Client ${client.id} is connected.`);
  
  io.emit('message', "Welcome to Consumer Server!!!");
});

httpServer.listen(3000, () => {
  logger.loginfo("HTTP server is serving and listening on 3000");
});
