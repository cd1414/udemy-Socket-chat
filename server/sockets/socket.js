const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utilities/utilities');

const users = new Users();

io.on('connection', (client) => {
    console.log('user connect');

    client.on('enterChat', (data, callback) => {
        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name and room are required'
            })
        }
        client.join(data.room);
        let people = users.addPerson(client.id, data.name, data.room);
        client.broadcast.to(data.room).emit('sendMessage', createMessage('Admin', `${data.name} connected to the chat`));
        client.broadcast.to(data.room).emit('peopleList', users.getPeople(data.room));
        callback(users.getPeople(data.room));
    });

    client.on('disconnect', () => {
        console.log('disconect');
        let personDeleted = users.deletePerson(client.id);

        client.broadcast.to(personDeleted.room).emit('sendMessage', createMessage('Admin', `${personDeleted.name} left the chat`));
        // client.broadcast.to(personDeleted.room).emit(users.getPeople(personDeleted.room));
        client.broadcast.to(personDeleted.room).emit('peopleList', users.getPeople(personDeleted.room));
    });

    client.on('sendMessage', (data, callback) => {
        let user = users.getPerson(client.id);
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('sendMessage', message);

        callback(message);
    });

    client.on('sendPrivateMessage', (data) => {

        if (!client.id) {
            return;
        }

        let user = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('sendPrivateMessage', createMessage(user.name, data.message));
    });
});