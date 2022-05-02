const chalk = require('chalk')
const log = console.log
const moment = require('moment')
const CronJob = require('cron').CronJob
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const rateLimiter = require("express-rate-limit");

/**
 * Setup the port if needed
 * @param config yaml config
 * @returns {*} port
 * @private
 */
function port(config) {
    let {port = process.env.PORT} = config
    if (!port) {
        log(chalk.yellow('No port specified using ::3000'), chalk.yellow('at ' + moment().format('DD/MM/YYYY hh:mm:ss')))
        port = 3000
    }
    return port
}


function resources(service) {

    const app = service.get('app')
    const config = service.get('config')

    if (!config.resources) return

    if (config.resources.storage) {
        Object.keys(config.resources.storage).forEach(key => {
            app.use(config.resources.storage[key], app.static(path.join(require.main.filename, '..', key)))
        })
    }
}

function runActionsOnStartup(service) {
    const actions = service.get('actions')
    const actionsState = service.get('actionsState')
    try {
        actionsState.forEach(({name, id}) => {

            if (actionsState[id].runOnStartup) {
                if (actions.running) log(chalk.red(`Action ${name} already running, stop it to start it again`))

                log(chalk.green(`Action ${name} started`))

                startAction(service, id)

            }
        })
    } catch (e) {
        console.log(e)
    }

}

function setupActions(service) {
    const handler = service.get('handler')
    const config = service.get('config')

    let actions = []
    let actionsState = []
    if (config.actions) {
        config.actions.forEach((action, index) => {

            if (!action.cron) throw ('No periodicity provided !')
            if (!action.name) throw ('No function provided !')

            actions.push({
                id: index, action: new CronJob(action.cron, async () => {
                    await handler[action.name](// pass useful functions
                        {
                            action, publish: (topic, message) => publishMessage(service, topic, message),
                        })
                })
            })
            actionsState.push({
                id: index,
                name: action.name,
                createdAt: new Date().toISOString(),
                running: false,
                runOnStartup: action.runOnStartup
            })
        })
    }


    service.set('actions', actions)
    service.set('actionsState', actionsState)
}

function startAction(service, id) {
    try {
        let actions = service.get('actions')
        let actionsState = service.get('actionsState')
        const {action} = actions[id]

        if (actionsState[id].running) throw ('Action already running, stop it to start it again')

        action.start()
        actionsState[id].running = true

        service.set('actionsState', actionsState)
    } catch (e) {
        console.log(e)
        throw (e)
    }

}

function stopAction(service, id) {
    try {
        const actions = service.get('actions')
        let actionsState = service.get('actionsState')
        const {action} = actions[id]

        if (!actionsState[id].running) throw ('Action not running, start it to stop it again')

        action.stop()
        actionsState[id].running = false

        service.set('actionsState', actionsState)
    } catch (e) {
        throw (e)
    }

}

function listActions(service) {
    return service.get('actionsState')
}

function currentRoute(microservice) {
    microservice.use((req, res, next) => {
        log(chalk.yellow(req.method), chalk.yellow(req.path), 'at ' + moment().format('DD/MM/YYYY hh:mm:ss'))
        if (req.path === '/') return res.sendStatus(403)
        return next()
    })
}

function requestLogger(microservice) {
    const accessLogStream = fs.createWriteStream(path.join(process.mainModule.filename, '../logs', 'access.log'), {flags: 'a'})
    microservice.use(morgan('combined', {stream: accessLogStream}))
}

function tree(service) {
    const config = service.get('config')

    const {actions, routes, events} = config

    if (actions) {
        if (!actions.length) {
            log(chalk.red('No actions defined'))
            return
        }

        log(chalk.blue.yellow('Available scheduled actions (' + actions.length + ')'))

        actions.forEach((action) => {
            if (!action) throw 'No name specified for scheduled Function !'

            log(chalk.blue('Action '), chalk.blue(action.name),)
            log(action.description ? chalk.green(action.description) : chalk.grey('No description provided'),)
        })
    }
    if (routes) {
        if (!routes.length) {
            log(chalk.red('No routes defined'));
            return
        }
        log(chalk.blue.yellow('Available routes (' + Object.keys(routes).length + ')'))

        routes.forEach(route => log(chalk.blue(route.method), chalk.blue(route.endpoint), route.description ? chalk.green('\n' + route.description) : chalk.grey('\n' + 'No description provided'), params(route.params) + '\n'))
    }

    if (events) {
        if (!events.length) {
            log(chalk.red('No events defined'));
            return
        }
        events
            .forEach(event => log(chalk.cyan(event.name), event.description ? chalk.cyanBright('\n' + event.description) : chalk.grey('\n' + 'No description provided') + '\n'))
    }
}

function params(params) {
    if (!params) return ''

    let log = ''
    if (params.required && params.required.length) log += '\n' + chalk.red('required : ')
    if (params.required && params.required.length) params.required.forEach(param => log += chalk.red(param) + ' ')

    if (params.optional && params.optional.length) log += '\n' + chalk.yellow('optional : ')
    if (params.optional && params.optional.length) params.optional.forEach(param => log += chalk.yellow(param) + ' ')

    return log
}

async function request(microservice, route) {
    try {
        const http = microservice.get('http')

        return await http(microservice, route)
    } catch (e) {
        log(chalk.red('Request fatal error', e.toString()))
    }
}

function rateLimit(service, duration = 15 * 60 * 1000, limit = 10000) {
    const app = service.get('app')

    const limiter = rateLimiter({
        windowMs: duration, max: limit, standardHeaders: true, message: "TooManyRequests"
    })
    //app.use(limiter);
}

function socket(service) {
    try {


        const handler = service.get('handler')
        const server = service.get('server')
        const config = service.get('config')


        // act as client
        if (config.eventSource) {
            switch (process.env.ENV) {
                // prod setup
                case 'production':
                    break;
                default:
                    const {io} = require("socket.io-client");

                    io.eventsManager = {
                        publish: (topic, message) => publishMessage(service, topic, message)
                    }

                    const client = io.connect(`http://${config.eventSource.server.development.endpoint}:${config.eventSource.server.development.port}`, {
                        'reconnection delay': 0,
                        'reopen delay': 0,
                        'force new connection': true,
                        transports: ['websocket', 'polling'],
                        query: {clientType: 'service'}
                    });
                    client.on("connect", () => {
                        console.log(`Connected to Event Source provider at : http://${config.eventSource.server.development.endpoint}:${config.eventSource.server.development.port}`)
                        service.set('eventSource', client)
                    });

                    // client
                    // catch eventSource events
                    if (handler['event']) client.on('event', (data) => handler['event'](io, client, data))
                    break;
            }
        }

        // act as websocket server
        if (config.events && config.events.length) {
            const io = require('socket.io')(server, {
                transports: ['websocket', 'polling'], cookie: true, secure: true, cors: {
                    origin: "*", methods: ["GET", "POST"]
                }
            })

            io.eventsManager = {
                publish: (topic, message) => publishMessage(service, topic, message)
            }
            io.on('connection', (client) => {

                const query = client.handshake.query
                // it's a service, register it to event room
                if (query && query.clientType && query.clientType === 'service') {
                    client.join("event");
                }

                // PubSub to be used in the app
                if ((config.events && config.events.length) > 0) {
                    (config.events).forEach(event => {
                        client.on(event.name, (data) => {

                            if (event.name === 'event') {
                                // reserved event !
                                // just broadcast it to other connected services
                                console.log(`Getting Event [${event.name}] -> Broadcast to event room`)
                                if (handler['event'])
                                    handler['event'](io, client, data)
                                client.to("event").emit(event.name, data);
                            } else {
                                handler[event.name](io, client, data)
                            }
                        })
                    })
                }

                client.on('disconnect', () => {
                    client.leave('event')
                    client.removeAllListeners()
                })
            })

            service.set('socket', io)

        }
    } catch (e) {
        console.log(e)
    }
}

function publishMessage(service, topic = 'event', message = {}) {
    const socket = service.get('eventSource')
    const config = service.get('config')

    if (!socket) return

    try {
        socket.emit(topic, {...message, source: config.name, createdAt: new Date().toISOString()});

        return new Date().toISOString()
    } catch (e) {
        console.log(e)
    }
}

function routes(service) {
    const config = service.get('config')
    if (config.routes) {
        config.routes.forEach(route => request(service, route))
    } else log(chalk.red('no appRoutes'))
}


module.exports = {
    rateLimit,
    request,
    requestLogger,
    tree,
    currentRoute,
    resources,
    port,
    setupActions,
    runActionsOnStartup,
    publishMessage,
    listActions,
    startAction,
    stopAction,
    socket,
    routes,
}
