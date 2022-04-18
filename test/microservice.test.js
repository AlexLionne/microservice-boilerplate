const microservice = require("../module/microservice");
const request = require('axios')
const {io} = require("socket.io-client");

describe('Microservice core test', () => {
    const options = {
        name: 'test microservice', functions: '../functions/index.js', port: 4300,
    }

    let {get, start, stop} = microservice(options)

    afterAll(() => stop())

    it('should get app microservice', function () {
        const server = get('app')
        expect(server).not.toBe(null)
    });
    it('should start app microservice', function () {
        const startedAt = start()
        expect(startedAt).not.toBe(null)
    });
    it('should stop app microservice', function () {
        const stoppedAt = stop()
        expect(stoppedAt).not.toBe(null)
    });
})
describe('Microservice requests test', () => {

    const options = {
        name: 'test microservice', functions: '../functions/index.js', port: 4300, routes: [{
            name: 'testGet',
            description: "test endpoint",
            method: 'GET',
            endpoint: '/test/get',
            cors: true,
            logged: false
        }, {
            name: 'testPost',
            description: "test endpoint",
            method: 'POST',
            endpoint: '/test/get',
            cors: true,
            logged: false
        }, {
            name: 'testPut',
            description: "test endpoint",
            method: 'PUT',
            endpoint: '/test/get',
            cors: true,
            logged: false
        }, {
            name: 'testDelete',
            description: "test endpoint",
            method: 'DELETE',
            endpoint: '/test/get',
            cors: true,
            logged: false
        }]
    }

    let {start, stop} = microservice(options)

    const instance = request.create({
        baseURL: `http://127.0.0.1:${options.port}`, timeout: 60000 * 2,
    });

    beforeAll(() => start())
    afterAll(() => stop())

    it('should do a get request', async function () {
        const response = await instance.get('/test/get')
        expect(response.status).toBe(204)
    });
    it('should do a post request', async function () {
        const response = await instance.post('/test/get', {})
        expect(response.status).toBe(204)
    });
    it('should do an put request', async function () {
        const response = await instance.put('/test/get')
        expect(response.status).toBe(204)
    });
    it('should do a delete request', async function () {
        const response = await instance.delete('/test/get')
        expect(response.status).toBe(204)
    });
})
describe('Microservice socket test', () => {
    const options = {
        name: 'Test Socket Microservice', functions: '../functions/index.js', port: 4300, events: [{
            name: 'ping', description: 'test ping socket'
        }]
    }

    let {start, stop, get} = microservice(options)

    let socket

    beforeEach((done) => {
        // Setup
        // Do not hardcode server port and address, square brackets are used for IPv6
        socket = io.connect(`http://127.0.0.1:${options.port}`, {
            'reconnection delay': 0, 'reopen delay': 0, 'force new connection': true, transports: ['websocket'],
        });
        socket.on('connect', () => {
            done();
        });
    });

    beforeAll(() => {
        start()
    })
    afterAll(() => {
        socket.disconnect()
        stop()
    })

    it('should get socket service', function () {
        const socket = get('socket')
        expect(socket).not.toBe(null)
    });
    it('should connect to socket service', function () {
        expect(socket.connected).toBe(true)
    });
    it('should disconnect from socket', function () {
        socket.disconnect()
        expect(socket.connected).toBe(false)
    });
})
describe('Microservice ES functions test', () => {
    const options = {
        name: 'test microservice', functions: '../functions/index.js', port: 4300,
        eventSource: {
            server: {
                production:
                    {
                        name: 'events-microservice',
                        endpoint: '127.0.0.1',
                        port: 3002
                    },
                development:
                    {
                        name: 'events-microservice',
                        endpoint: '127.0.0.1',
                        port: 3002
                    }
            }
        },
        events: [
            {
                name: 'event', description: 'listen to eventSource'
            }
        ]
    }

    let {start, stop} = microservice(options)

    beforeAll(() => start())
    afterAll(() => stop())

    it('should send data to CREATE flow', async function () {
    });
    it('should send data to UPDATE flow', async function () {
    });
    it('should send data to DELETE flow', async function () {
    });

})
describe('Microservice actions functions test', () => {
    const options = {
        name: 'test microservice', functions: '../functions/index.js', port: 4300, routes: [{
            name: 'actionsList',
            description: "action list endpoint",
            method: 'GET',
            endpoint: '/test/actions',
            cors: true,
            logged: false
        }, {
            name: 'actionStop',
            description: "action stop endpoint",
            method: 'POST',
            endpoint: '/test/actions/:actionId/stop',
            cors: true,
            logged: false
        }, {
            name: 'actionStart',
            description: "action start endpoint",
            method: 'POST',
            endpoint: '/test/actions/:actionId/start',
            cors: true,
            logged: false
        }], actions: [{
            cron: '* * * * *',
            name: 'actionTest1Seconds',
            description: "action that log each 2 second",
            runOnStartup: true,
        }]
    }

    let {start, stop} = microservice(options)

    const instance = request.create({
        baseURL: `http://127.0.0.1:${options.port}`, timeout: 60000 * 2,
    });

    beforeAll(() => start())
    afterAll(async () => {
        const response = await instance.get('/test/actions')

        const actions = response.data

        for (const action of actions) {
            await instance.post(`/test/actions/${action.id}/stop`)
        }

        return stop()
    })
    it('should list 1 action', async function () {
        const response = await instance.get('/test/actions')
        expect(response.data.length).toBe(1)
    });
    it('should stop an action', async function () {
        const {data: actions} = await instance.get('/test/actions')

        const [action] = actions
        // wait 5 sec
        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await instance.post(`/test/actions/${action.id}/stop`)
        expect(response.status).toBe(204)
    });
    it('should start an action', async function () {
        const {data: actions} = await instance.get('/test/actions')

        const [action] = actions
        const response = await instance.post(`/test/actions/${action.id}/start`)

        expect(response.status).toBe(204)
    });
})
