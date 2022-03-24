const chalk = require('chalk')
const models = require("../../plugins/model-plugin/models");
const logger = require("../../plugins/logger/logger")
const {PubSub} = require("../pub-sub/pub-sub");

module.exports = function request(microservice, handler, plugins, route, log, dispatcher) {

    const {endpoint, method, cors, logged} = route

    if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option', 'patch'].includes(method.toLowerCase())))
        return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

    async function middleware(req, res, next) {
        try {
            //pass the logger
            req.logger = logger

            await dispatcher(plugins, handler, req, res, next, route)
        } catch (e) {
            log(chalk.red(e.message))
            return res.status(500).send()
        }
    }

    async function servicesMessaging(req, res, next) {
        req.PubSub = PubSub
        next()
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
                const userId = await req.models.Token.handleToken(req, res)

                if (!userId) return res.status(403).send()

                req.userId = userId
            }
            next()
        } catch (e) {
            log(chalk.red(e.message))
            return res.status(500).send()
        }
    }


    try {
        if (method.toLowerCase() === 'get') microservice.get(endpoint, servicesMessaging, authenticate, middleware)
        if (method.toLowerCase() === 'post') microservice.post(endpoint, servicesMessaging, authenticate, middleware)
        if (method.toLowerCase() === 'put') microservice.put(endpoint, servicesMessaging, authenticate, middleware)
        if (method.toLowerCase() === 'delete') microservice.delete(endpoint, servicesMessaging, authenticate, middleware)
    } catch (e) {
        log(chalk.red(e.message))
        return e.message
    }


}
