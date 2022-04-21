const log = console.log;
const formData = require('express-form-data');
const express = require('express');
const body = require('body-parser');
const path = require('path');
const session = require('express-session')
const app = express();
const chalk = require('chalk')
const moment = require('moment')
const compression = require('compression')
require('dotenv').config()

const server = require('http').createServer(app);


const {
    rateLimit,
    tree,
    setupActions,
    runActionsOnStartup,
    currentRoute,
    resources,
    port,
    socket,
    routes,
} = require('./functions')

currentRoute(app)

app.use(body.urlencoded({limit: '5mb', extended: true}));
app.use(body.json({limit: '5mb'}))
app.use(formData.parse({autoClean: true}));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(compression())
app.use(session({secret: 'secret', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization, Origin");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next()
})
const {http} = require('./http')

/**
 * Microservice module
 *
 * handle express app with an yml configuration
 * @param options yml (readable as jspn) configuration file
 */


function microservice(options) {


    let config = options || null

    if (!config) {
        log(chalk.red('No configuration file for Microservice(config)'), chalk.red('at ' + moment().format('DD/MM/YYYY hh:mm:ss')))
        throw 'No configuration file for microservice'
    }

    const handler = require(path.join(require.main.filename, config.functions))

    let microservice = new Map()

    /**
     * State Manager
     */
    // pub sub subscriptions
    microservice.set('subscriptions', [])
    // express app instance
    microservice.set('app', app)
    // http server instance
    microservice.set('server', server)
    // http middlewares
    microservice.set('http', http)
    // static functions
    microservice.set('handler', handler)
    // scheduled actions
    microservice.set('actions', [])
    // scheduled actions state wrapper
    microservice.set('actionsState', [])
    // microservice config
    microservice.set('config', config)
    // log the route tree
    tree(microservice)

    // stop server
    function stop() {
        get('server').close();
        return new Date().toISOString()
    }

    // get store
    function get(tag = '*') {
        if (tag === '*') return microservice
        else return microservice.get(tag)
    }

    // start server
    function start() {
        const appPort = port(config)

        rateLimit(microservice)
        resources(microservice)
        socket(microservice)
        setupActions(microservice)
        runActionsOnStartup(microservice)
        routes(microservice)

        server.listen(appPort, () => log(chalk.bold.green(config.name) + chalk.reset(' Running on ') + appPort))

        return new Date().toISOString()
    }

    return {start, stop, get}
}


module.exports = microservice
