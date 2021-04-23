const chalk = require('chalk')
const auth = require("../../plugins/model-plugin/config/auth");
const {User} = require("../../plugins/model-plugin/models");
const logger = require("../../plugins/logger/logger")
const passport = require("../../module/passport/passport")

module.exports = function request(microservice, handler, plugins, route, log, dispatcher) {

    const {endpoint, method, cors, logged} = route

    if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option'].includes(method.toLowerCase())))
        return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

    async function middleware(req, res, next) {

        let response
        try {
            //pass the logger
            req.logger = logger
            req.passport = passport

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
        const passport = logged ? auth.required : auth.optional

        if (method.toLowerCase() === 'get') microservice.get(endpoint, passport, middleware)
        if (method.toLowerCase() === 'post') microservice.post(endpoint, passport, middleware)
        if (method.toLowerCase() === 'put') microservice.put(endpoint, passport, middleware)
        if (method.toLowerCase() === 'delete') microservice.delete(endpoint, passport, middleware)

    } catch (e) {
        return e.message
    }


}
