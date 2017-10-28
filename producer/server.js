const express = require('express');
const app = express();
const server = require('http').createServer(app);
const websocket = require('express-ws')(app, server);

// Routers

app.use(express.static('public'))

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        console.log('Incoming message:', msg)
        ws.send("Your message is received");
        connectedClient.forEach((client) => {
            client.send(msg);
        });
    });
});
server.listen(8000);
