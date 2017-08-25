var socket = io();

function scrollToBottom() {
  var messages = $("#messages");
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

// CONNECT //////////////////////////////////////////////////////////////////

socket.on('connect', function () {
  //console.log('Connected to server');
  // window.location.search contienei parametri passati nell'url
  // deparam è una piccola libreria esterna che consente di
  // convertire una stringa di parametri (quelli dell'url) in un oggetto
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }
  });
});

// DISCONNECT ///////////////////////////////////////////////////////////////

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// UPDATE USER LIST ////////////////////////////////////////////////////////

socket.on('updateUserList', function (users) {
  var ol = $('<ol></ol>');

  users.forEach(function (user) {
    var li = $('<li></li>').text(user);
    ol.append(li);
  });

  $('#users').html(ol);
});
// NEW MESSAGE /////////////////////////////////////////////////////////////

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm:ss');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();

  // console.log('New message', message);
  // var li = $('<li></li>');
  // li.text(`[${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}] ${message.from}: ${message.text}`);
  //
  // $("#messages").append(li);
});

// NEW LOCATION MESSAGE ////////////////////////////////////////////////////

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('HH:mm:ss');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
  // var li = $('<li></li>');
  // var a = $('<a target="_blank">My current location</a>');
  // a.attr('href', message.url);
  // li.text(`[${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}] ${message.from}: `).append(a);
  //
  // $("#messages").append(li);
});

// ON SUBMIT ///////////////////////////////////////////////////////////////

$('#message-form').on('submit', (e) => {
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function(data) {
    messageTextbox.val('');
  });
});

// SUBMIT LOCATION /////////////////////////////////////////////////////////
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
