const io = require('socket.io-client')

const SOCKET_URL = process.env.ENV === 'DEV' ? 'ws://nesga-socket:3800': 'ws://api.nesga.fr/socket'

function socket() {
    return io(SOCKET_URL, {
        jsonp: false,
        transports: ['websocket']
    });
}

export {socket}

