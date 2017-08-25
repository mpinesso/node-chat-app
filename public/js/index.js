var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New message', message);
  var li = $('<li></li>');
  li.text(`[${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}] ${message.from}: ${message.text}`);

  $("#messages").append(li);
});

socket.on('newLocationMessage', function (message) {
  console.log('New message', message);
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');
  a.attr('href', message.url);
  li.text(`[${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}] ${message.from}: `).append(a);

  $("#messages").append(li);
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    from: 'Frank',
    text: messageTextbox.val()
  }, function(data) {
    messageTextbox.val('');
  });
});

var locationButton = $("#send-location");
locationButton.on('click', function () {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
