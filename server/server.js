// librerie di node
const path = require('path');
const http = require('http');

// librerie esterne
const express = require('express');
const socketIO = require('socket.io');

// costanti
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// variabili
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// configurazione del server
  // indica dove sono situati i file statici (html, img, ...)
app.use(express.static(publicPath)); // middleware

///////////////////////////////////////////////////////////////////
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
///////////////////////////////////////////////////////////////////
// configura la porta del server
server.listen(port, () =>{
  console.log(`Started on port ${port}`);
})
