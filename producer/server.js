const express = require('express');
const app = express();

const httpServer = require('http').createServer(app);

const Kafka = require('kafka-node');
const Producer = Kafka.Producer;
const Client = Kafka.Client;

const myClient = new Client('localhost:2181');
const myProducer = new Producer(myClient);

myProducer.on('ready', () => {
  const shouldAsync = false;
  myProducer.createTopics(['messages'], shouldAsync, (err, data) => {
    console.log(err, data);
  });
})

const connectedClient = {};

// Routers
app.use(express.static('public'))

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

const io = require('socket.io')(httpServer);

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  
  socket.on('disconnect', () => {
    console.log(socket.id, 'has disconnected');
  });
  
  socket.on('message', createMessageHandler(socket));
  
  connectedClient[socket] = socket;
});

function createMessageHandler(socket) {
  return (msg) => {
    console.log(msg, 'from', socket.id)
    io.emit('message', msg);
    
    const payload = {
      topic: 'message',
      messages: msg, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
      timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
    }
    
    myProducer.send([payload], (err, data) => {
      console.log(err, data, "is committed to Kafka cluster");
    })
  }
}

httpServer.listen(8000, () => {
  console.log("Serving and listening on 8000")
});
