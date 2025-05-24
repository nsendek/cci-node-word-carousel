const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const server = app.listen(port);

app.use(express.static('public'));

console.log(`Server is listening on port ${port}`);

const socket = require("socket.io");
const io = socket(server);

let words = [];

io.sockets.on('connection', (socket) => {
  console.log("new connection: " + socket.id);

  socket.emit("allWords", { words: words });
  socket.on('clear', () => {
    words = [];
  });
  socket.on('addWord', (data) => {
    words.push(data);
    words = words.slice(-15);
    io.emit('addWord', data);
  });
});