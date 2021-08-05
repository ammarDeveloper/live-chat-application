let users = [];

// stores when user joins
function userJoin(id, username, room){
    const user = {
        id:id,
        username:username, 
        room:room
    };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// user leaves the chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};