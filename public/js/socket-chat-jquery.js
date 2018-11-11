var params = new URLSearchParams(window.location.search);

var name = params.get('name');
var room = params.get('room');

//jquery references
var divUsuarios = $('#divUsuarios');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');
var chatTitle = $('#chat-title');


//render user
//people = person array
function renderUser(people) {

    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active">' + params.get('room') + '</a>';
    html += '</li>';

    for (var i = 0; i < people.length; i++) {
        html += '<li>'
        html += '    <a data-id="' + people[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + people[i].name + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuarios.html(html);
}

function renderMessages(message, otherUser) {
    var html = '';
    var date = new Date(message.date);
    var time = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';

    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (!otherUser) {
        html += '<li class="animated fadeIn">';

        if (message.name != 'Admin') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '    <h5>' + message.name + '</h5>';
        html += '    <div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + time + '</div>';
        html += '</li>';
    } else {
        html += '<li class="reverse animated fadeIn">';
        html += '<div class="chat-content">';
        html += '    <h5>' + message.name + '</h5>';
        html += '    <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + time + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

function renderChatBox(room) {

    var html = '';

    html += '<div class="p-20 b-b">';
    html += '    <h3 class="box-title"> Chat ' + room + '</h3>';
    html += '</div>';


    chatTitle.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listeners
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {

    }
});



formSend.on('submit', function(e) {
    e.preventDefault();
    if (txtMessage.val().trim().length === 0) {
        return;
    }

    socket.emit('sendMessage', {
        name,
        message: txtMessage.val()
    }, function(mesage) {
        txtMessage.val('').focus();
        renderMessages(mesage, true);
        scrollBottom();
    });
});