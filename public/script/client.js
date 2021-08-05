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

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);
    messageBox.scrollTop = messageBox.scrollHeight;
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
    div.classList.add('right');
    div.innerHTML = `<h5>${message.username}</h5>
    <h6>${message.time}</h6>
    <p>${message.text}</p>`
    document.querySelector('#chat-box').appendChild(div);
}

// Add room name to DOM
function outputRoomname(room){
    roomName.innerText = room;
}

// Add users name to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}