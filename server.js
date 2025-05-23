const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const server = app.listen(port);

app.use(express.static('public'));

console.log(`Server is listening on port ${port}`);

const socket = require("socket.io");
const io = socket(server);

/*
 * this array holds everything that has been drawn since the server started.
 * IMPORTANT: any data stored here will disappear when the server is stopped/started.
 */
const strokes = [];

io.sockets.on('connection', (socket) => {
  console.log("new connection: " + socket.id);

  // send just this new client all of the past strokes it should
  // draw on the canvas.
  socket.emit("allDrawingData", {strokes: strokes});

  // event handling when we receive a new drawing element from this
  // socket: send it out to everyone.
  socket.on('drawStroke', (data) => {
    strokes.push(data.points);
    io.emit('drawStroke', data);
  })
});