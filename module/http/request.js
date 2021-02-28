const chalk = require('chalk')

module.exports = function request(microservice, handler, plugins, route, log, dispatcher) {

  const {endpoint, method, cors} = route

  if (!endpoint || !endpoint.includes('/') || (!['get', 'post', 'put', 'delete', 'options', 'option'].includes(method.toLowerCase())))
    return log(chalk.red('Check endpoint configuration nor method used in the configuration file'))

  async function middleware(req, res, next) {
    let response
    try {
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
    if (method.toLowerCase() === 'get') return microservice.route(endpoint).get(middleware)
    if (method.toLowerCase() === 'post') return microservice.route(endpoint).post(middleware)
    if (method.toLowerCase() === 'put') return microservice.route(endpoint).put(middleware)
    if (method.toLowerCase() === 'delete') return microservice.route(endpoint).delete(middleware)

  } catch (e) {
    return e.message
  }


}
