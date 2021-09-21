const chalk = require('chalk')
const {Token} = require("../../plugins/model-plugin/models");
const logger = require("../../plugins/logger/logger")

module.exports = function request(microservice, handler, plugins, route, log, dispatcher) {

    const {endpoint, method, cors, logged} = route

    if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option'].includes(method.toLowerCase())))
        return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

    async function middleware(req, res, next) {
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Credentials", true);
        
        try {
            //pass the logger
            req.logger = logger

            if (logged) {
                //authenticate the user with jwt
                const jwt = await Token.handleToken(req, res)
                if (!jwt) return res.status(403).send()
            }

            await dispatcher(plugins, handler, req, res, next, route)
        } catch (e) {
            log(chalk.red(e.message))
        }
    }

    try {

        if (method.toLowerCase() === 'get') microservice.get(endpoint, middleware)
        if (method.toLowerCase() === 'post') microservice.post(endpoint, middleware)
        if (method.toLowerCase() === 'put') microservice.put(endpoint, middleware)
        if (method.toLowerCase() === 'delete') microservice.delete(endpoint, middleware)

    } catch (e) {
        return e.message
    }


}
