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
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
///////////////////////////////////////////////////////////////////
// configura la porta del server
server.listen(port, () =>{
  console.log(`Started on port ${port}`);
})
