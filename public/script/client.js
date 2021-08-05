const socket = io();
const chatForm = document.querySelector('#send-container');
const messageBox = document.querySelector('#chat-box');
const roomName = document.querySelector('.room-name');
const userList = document.querySelector('#users-unordered-list');


// get the username and the room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// join chatroom
socket.emit('joinRoom', ({username, room}));


// get room users
socket.on('roomUsers', ({room, users}) => {
    outputRoomname(room);
    outputUsers(users);
});

// message to others
socket.on('message', message =>{
    outputMessage(message);
    messageBox.scrollTop = messageBox.scrollHeight;
});

// message to me
socket.on('messageMe', message =>{
    outputMessageMe(message);
    messageBox.scrollTop = messageBox.scrollHeight;
});

// admin bot message
socket.on('messageAdmin', message => {
    outputMessageAdmin(message);
    messageBox.scrollTop = messageBox.scrollHeight;
})

// to change the user's name
socket.on('userName', username => {
    setName(username);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.textmessage.value;
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.textmessage.value = '';
    e.target.elements.textmessage.focus()
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message-sent');
    div.classList.add('left');
    div.innerHTML = `<h5>${message.username}</h5>
    <h6>${message.time}</h6>
    <p>${message.text}</p>`
    document.querySelector('#chat-box').appendChild(div);
}

function outputMessageMe(message) {
    const div = document.createElement('div');
    div.classList.add('message-sent');
    div.classList.add('right');
    div.innerHTML = `<h5>${message.username}</h5>
    <h6>${message.time}</h6>
    <p>${message.text}</p>`
    document.querySelector('#chat-box').appendChild(div);
}

function outputMessageAdmin(message) {
    const div = document.createElement('div');
    div.classList.add('admin-message');
    div.innerHTML = `<div>${message.text} at ${message.time}</div>`
    document.querySelector('#chat-box').appendChild(div);
}

// Add room name to DOM
function outputRoomname(room){
    roomName.innerText = room;
}

// Add users name to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li><i class="fa fa-user-circle"></i>${user.username}</li>`).join('')}`
}

// setting the name of the user
function setName(username) {
    const usernamediv = document.querySelector('#name');
    usernamediv.innerHTML = `<i class="fa fa-user-circle"></i>${username}`;
}