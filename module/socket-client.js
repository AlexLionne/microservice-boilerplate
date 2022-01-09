const io = require('socket.io-client/dist/socket.io')

const SOCKET_URL = process.env.ENV === 'DEV' ? 'ws://nesga-socket:3800' : 'ws://api.nesga.fr/socket'

module.exports.socket = () => io(SOCKET_URL, {
        jsonp: false,
        transports: ['websocket']
    });

