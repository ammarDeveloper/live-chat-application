const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMsg = require('../utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, '../public')));
const botName = 'Admin Bot';

// Run when client connnects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // welcome the current user
        socket.emit('message', formatMsg(botName, "Welcome to live chat"));

        // Broadcast when user joins
        socket.broadcast.to(user.room).emit('message', formatMsg(botName, `${user.username} has joined the chat`));

        // send users and room information
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // listen for chatMessage
    socket.on('chatMessage', message => {
        let user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMsg(`${user.username}`, message));
    });


    // Runs when user leaves
    socket.on('disconnect', () => {
        let user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMsg(botName, `${user.username} left`));

            // send users and room information
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const port = 3000 || process.env.port;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

// // node server which will handle socket io connection
// const io = require('socket.io')(8000);

// const users = {};

// io.on('connection', socket => {
//     socket.on('new-user-joined', name => {
//         if(name !== null){
//             console.log(name);
//             users[socket.id] = name;
//             socket.broadcast.emit('user-joined', name);
//         }
//     });

//     socket.on('send', message => {
//         socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
//     });
// });