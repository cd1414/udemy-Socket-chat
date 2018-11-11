var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('name') || (!params.has('room'))) {
    window.location = 'index.html';
    throw new Error('Name and room are required');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

//list info to the server
socket.on('connect', function() {
    console.log('connect to the server');

    socket.emit('enterChat', user, function(resp) {
        //console.log('Logged users', resp);
        renderUser(resp);
        renderChatBox(user.room);
    });
});

socket.on('disconnect', function() {
    console.log('Lost connection with the server');
});

socket.on('peopleList', function(data) {
    renderUser(data);
});

//listen the backend
socket.on('sendMessage', function(message) {
    //console.log(message);
    renderMessages(message, false);
    scrollBottom();
});

//
socket.on('sendPrivateMessage', function(message) {
    console.log('Private message', message);
});