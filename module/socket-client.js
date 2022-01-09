const {io} = require('socket.io-client')

const SOCKET_URL = process.env.ENV === 'DEV' ? 'ws://nesga-socket:3800' : 'ws://api.nesga.fr/socket'

module.exports = function socket(url = SOCKET_URL) {
    return io(url, {
        jsonp: false,
        transports: ['websocket']
    });
}

