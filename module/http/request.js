const chalk = require('chalk')
const models = require("../../module/models/models");
const {startAction, stopAction, listActions, publishMessage} = require("../functions");
const log = console.log

module.exports = function http(service, route) {
    const microservice = service.get('app')
    const handler = service.get('handler')

    const {endpoint, method, logged, name} = route

    if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option', 'patch'].includes(method.toLowerCase())))
        return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

    async function middleware(req, res, next) {
        try {
            if (!handler[name]) {
                log(chalk.red('No functions associated with this route'))
                log(chalk.red('Handler could be null to'))
            }

            await handler[name](req, res, next)
        } catch (e) {
            log(chalk.red(e))
            return res.status(500).send()
        }
    }

    async function authenticate(req, res, next) {
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization, Origin");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.header("Access-Control-Allow-Credentials", true);
        try {
            req.models = models
            // current route require logged privilege in config.yml
            if (logged) {
                //authenticate the user with jwt, returns userId
                const id = await req.models.Token.handleToken(req, res)

                if (!id) return res.status(403).send()

                req.id = id
            }
            next()
        } catch (e) {
            log(chalk.red(e.message))
            return res.status(500).send()
        }
    }

    function actionManager(req, res, next) {
        req.actionManager = {
            start: (id) => startAction(service, id),
            stop: (id) => stopAction(service, id),
            actions: () => listActions(service)
        }
        next()
    }

    function socketServer(req, res, next) {
        req.socketServer = service.get('socket')
        next()
    }

    function eventSourcing(req, res, next) {
        req.eventsManager = {
            publish: (topic, message) => publishMessage(service, topic, message),
        }
        next()
    }

    try {
        if (method.toLowerCase() === 'get') microservice.get(endpoint, socketServer, actionManager, eventSourcing, authenticate, middleware)
        if (method.toLowerCase() === 'post') microservice.post(endpoint, socketServer, actionManager, eventSourcing, authenticate, middleware)
        if (method.toLowerCase() === 'put') microservice.put(endpoint, socketServer, actionManager, eventSourcing, authenticate, middleware)
        if (method.toLowerCase() === 'delete') microservice.delete(endpoint, socketServer, actionManager, eventSourcing, authenticate, middleware)
    } catch (e) {
        log(chalk.red(e.message))
        return e.message
    }


}
