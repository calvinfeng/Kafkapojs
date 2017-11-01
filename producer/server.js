const logger = require('./logger.js');

// Import Kafka client library
const Kafka = require('kafka-node');
const Producer = Kafka.Producer;
const Client = Kafka.Client;

const myClient = new Client('localhost:2181');

myClient.once('connect', () => {
  myClient.loadMetadataForTopics([], (err, results) => {
    results.forEach((result) => logger.loginfo(result));
  });
});

const myProducer = new Producer(myClient);

myProducer.on('ready', () => {
  myProducer.createTopics(['messages'], false, (err, data) => {
    if (err) logger.logerr(err);
    if (data) logger.loginfo(data);
  });
});

myProducer.on('error', (err) => {
  logger.logerr(`${err.constructor.name}: ${err.message}`);
});

// Instantiate Express http server
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);

// Routers
app.use(express.static('public'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Socket.io
const io = require('socket.io')(httpServer);

function createMessageHandler(socket) {
  return (msg) => {
    io.emit('message', msg);
    
    const topic = 'message';
    
    const payload = {
      topic: 'message',
      messages: msg, 
      timestamp: Date.now(),
      partition: Math.floor(Math.random() * 3)
    }
    
    myProducer.send([payload], (err, data) => {
      if (err) logger.logerr(`${err.constructor.name}: ${err.message}`);
      
      if (data) {
        const msg = data.message;
        Object.keys(msg).forEach((partition) => {
          const offset = msg[partition];
          logger.loginfo(`committed message on topic: ${topic}, partition:${partition}, offset:${offset}`);
        });
      }
    });
  }
}

io.on('connection', (client) => {
  logger.loginfo(`client ${client.id} is connected`);
  
  client.on('disconnect', () => {
    logger.logwarn(`${client.id} has disconnected`);
  });
  
  client.on('message', createMessageHandler(client));
});


httpServer.listen(8000, () => {
  logger.loginfo("serving and listening on 8000")
});
