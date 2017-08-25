// librerie di NODEJS
const path = require('path');
const http = require('http');

// librerie esterne
const express = require('express');
const socketIO = require('socket.io');

// File locali
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require ('./utils/users');

// costanti
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// variabili
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// configurazione del server
  // indica dove sono situati i file statici (html, img, ...)
app.use(express.static(publicPath)); // middleware

/////////////////////////////////////////////////////////////////////////////
io.on('connection', (socket) => {
  console.log('New user connected');

  // JOIN ROOM //////////////////////////////////////////////////////////////
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    // rimuovo l'utente da una potenziale altra ROOM
    users.removeUser(socket.id);
    // loggo l'utente nella nuova ROOM
    users.addUser(socket.id, params.name, params.room);

    // socket.leave(params.room);

    // io.emit -> io.to(params.room).emit
    // socket.broadcast.emit -> socket.broacast.to(params.room).emit
    //socket.emit

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
    callback();
  })

// CREATE MESSAGE ROOM //////////////////////////////////////////////////////
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback('');
  });
// CREATE MESSAGE LOCATION ROOM /////////////////////////////////////////////
  socket.on('createLocationMessage', (cords) => {
    var user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, cords.latitude, cords.longitude));
    }

  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }

  });
});
///////////////////////////////////////////////////////////////////
// configura la porta del server
server.listen(port, () =>{
  console.log(`Started on port ${port}`);
})
