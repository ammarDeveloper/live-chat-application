const moment = require('moment');

function formatMsg(username, text){
    return {
        username,
        text, 
        time: moment().format('hh:mm a')
    }
}

module.exports = formatMsg;