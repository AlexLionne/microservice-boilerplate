const chalk = require('chalk')
const {Token} = require("../../plugins/model-plugin/models");
const logger = require("../../plugins/logger/logger")

module.exports = function request(microservice, handler, plugins, route, log, dispatcher) {

    const {endpoint, method, cors, logged} = route

    if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option'].includes(method.toLowerCase())))
        return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

    async function middleware(req, res, next) {

        let response
        try {
            //pass the logger
            req.logger = logger

            if (logged) {
                //authenticate the user with jwt
                const jwt = await Token.handleToken(req, res)

                if (!jwt)
                    return res.status(403).send()
            }

            response = await dispatcher(plugins, handler, req, res, next, route)
        } catch (e) {
            res.sendStatus(500)
            log(chalk.red(e.message))
            throw e.message
        }

        if (cors) {
            res.setHeader('Access-Control-Allow-Origin',
                req.header('origin')
                || req.header('x-forwarded-host')
                || req.header('referer')
                || req.header('host'));

            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        }

        const {headers} = response

        if (response && headers) res.set(headers);
        else if (response) res.status(200).send(response);
        else res.status(404).send()
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
