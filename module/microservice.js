let express, body, cors, path, microserver, log, chalk, moment, io, formData, session;

log = console.log;
formData = require('express-form-data');
express = require('express');
body = require('body-parser');
cors = require('cors');
path = require('path');
session = require('express-session')
microserver = express();
chalk = require('chalk')
moment = require('moment')


microserver.use(body.urlencoded({limit: '5mb', extended: true}));
microserver.use(body.json({limit: '5mb'}))
microserver.use(formData.parse({autoClean: true}));
microserver.use(formData.format());
microserver.use(formData.stream());
microserver.use(formData.union());
microserver.use(session({secret: 'secret', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

require('dotenv').config()

const server = require('http').createServer(microserver);

io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const {
    _rateLimit,
    _plugins,
    _routingTree,
    _scheduledFunctions,
    _currentRoute,
    _resources,
    _port,
    _routes,
    _events,
    _compression
} = require('./functions')

_compression(microserver)
_currentRoute(microserver)

microserver.use(cors())
const {handleRequests} = require('./http')
/**
 * Microservice module
 *
 * handle express app with an yml configuration
 * @param config yml (readable as jspn) configuration file
 */

let config
let jobs = []
let plugins = []

const handler = require(path.join(process.mainModule.filename))

class Microservice {

    constructor(cfg) {

        config = cfg

        if (!config) {
            log(chalk.red('No configuration file for Microservice(config)'), chalk.red('at ' + moment().format('DD/MM/YYYY hh:mm:ss')))
            throw 'No configuration file for Microservice(config)'
        }

        plugins = _plugins(config)

        _routingTree(config)
    }


    start() {
        let {resources, routes, port, scheduledFunctions, events} = config

        //_rateLimit(microserver)
        _resources(resources)
        _routes(microserver, routes, handleRequests, cors, handler, plugins, log)

        io.on('connection', (client) => {
            /*client.onAny((name) => {
                log(chalk.yellow(name))
            })*/
            log(chalk.green('new client connected', client.id))
            Object.keys(events).forEach(key => {

                client.on(key, (data) => {
                    handler[key](io, client, data)
                })
            })
            client.on('disconnect', () => {
                log(chalk.red('client disconnected'))
                client.removeAllListeners();
            })
        })


        port = _port(config)
        jobs = _scheduledFunctions(scheduledFunctions, handler)

        microserver.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                res.status(err.status).send('Unauthorized');
                //logger.error(err);
                return;
            }
            next();
        })

        microserver.use(function(err, req, res, next){
            console.log(err.stack);
            res.status(500).send();
        });

        server.listen(port, () => {
            log(
                chalk.bold.green(config.name) + chalk.reset(' running on ') + port
            )
        })

        return {jobs}
    }


    startJob(name, req, res) {

        if (!jobs.length)
            return

        const {scheduledFunctions} = config
        try {
            if (scheduledFunctions) {
                const cron = jobs.filter(job => job.name === name)[0]
                //const index = jobs.indexOf(cron)

                cron.job.start()

                return {message: 'job ' + name + ' started'}
            }
        } catch (e) {
            console.error(e)

            res.status(500).send()
        }
    }

    getJobs() {
        return jobs
    }

    stopJob(req, res) {
        try {
            const {name} = req.query

            if (!jobs.length) {
                res.status(404).send()
                return
            }

            const cron = jobs.filter(job => job.name === name)[0]
            const index = jobs.indexOf(cron)

            if (index === -1) {
                res.status(404).send()
                return
            }

            cron.job.stop()

            res.status(204).send()

        } catch (e) {
            console.error(e)

            res.status(500).send()
        }
    }

}


module.exports = Microservice
