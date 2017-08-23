// librerie di NODEJS
const path = require('path');
const http = require('http');

// librerie esterne
const express = require('express');
const socketIO = require('socket.io');

// File locali
const {generateMessage, generateLocationMessage} = require('./utils/message');

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

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from String');
  });

  socket.on('createLocationMessage', (cords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', cords.latitude, cords.longitude));
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
