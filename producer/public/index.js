console.log('Hello');

const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('message', (msg) => {
  console.log(msg);
})

setInterval(() => {
  socket.send("Hello world!!!");
}, 1000)