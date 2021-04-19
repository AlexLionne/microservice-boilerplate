const chalk = require('chalk')
const log = console.log
const moment = require('moment')
const CronJob = require('cron').CronJob
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const compression = require('compression')

/**
 * Setup the port if needed
 * @param config yaml config
 * @returns {*} port
 * @private
 */
function _port(config) {
  let {port} = config
  if (!port) {
    log(chalk.yellow('No port specified using ::3000'), chalk.yellow('at ' + moment().format('DD/MM/YYYY hh:mm:ss')))
    port = 3000
  }

  return port
}

/**
 * Setup a& dispatch all the routes
 * @param microservice microservice that use routes
 * @param routes routes to be used
 * @param handleRequests functions
 * @param cors function handler of cors
 * @param handler handler function that dispatch actions
 * @param plugins plugins to be loaded
 * @param log log function
 * @private
 */
function _routes(microservice, routes, handleRequests, cors, handler, plugins, log) {

  if (routes) {
    Object.keys(routes).forEach(key => {
      let route = routes[key]
      if (route.cors) microservice.use(cors());
      //listen for requests
      handleRequests(microservice, handler, plugins, route, log, _request)
    })
  }
}

/**
 * Export resources to microservice
 * @param microservice microservice that use resources
 * @param express express module
 * @param resources storage or databases
 * @private
 */
function _resources(microservice, express, resources) {

  if (!resources || !microservice || !express)
    return

  if (storage) {
    Object.keys(storage).forEach(key => {
      microservice.use(storage[key], express.static(path.join(process.mainModule.filename, '..', key)))
    })
  }
}

/**
 *
 * @param scheduledFunctions list of scheduled functions from config
 * @param handler handle the functions
 * @returns {*} list of jobs
 * @private
 */

function _scheduledFunctions(scheduledFunctions, handler) {
  if (!scheduledFunctions || !scheduledFunctions.length)
    return

  let jobs = []

  scheduledFunctions.map(({cronExpression, functionName}) => {
    try {
      const job = new CronJob(cronExpression, async () => {
        await handler[functionName]()
      })
      jobs.push({name: functionName, job})
    } catch (e) {
      log(chalk.red(e.message))
      throw e.message
    }
  })

  return jobs
}

function _compression(microservice) {
  microservice.use(compression())
}

function _currentRoute(microservice) {
  microservice.use((req, res, next) => {
    log(chalk.yellow(req.method), chalk.yellow(req.path), 'at ' + moment().format('DD/MM/YYYY hh:mm:ss'))
    if (req.path === '/')
      return res.sendStatus(403)
    return next()
  })
}

function _requestLogger(microservice) {
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(path.join(process.mainModule.filename, '../logs', 'access.log'), {flags: 'a'})
  microservice.use(morgan('combined', {stream: accessLogStream}))
}

function _plugins(config) {
  let {plugins} = config

  if (!plugins || !plugins.length)
    return

  plugins = plugins.map(plugin => {
    const plug = require(path.join(__dirname, `../plugins/${plugin.name}/plugin`))

    plugins.push({
      ...plugin,
      plugin: plug
    })
  })

  log(chalk.bold.cyan(process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Development Mode'))

  return _loadedPlugins(plugins)
}

function _loadedPlugins(plugins) {
  let loadedPlugins = []
  log('Loaded plugins : ' + chalk.bold(loadedPlugins.toString()))

  return plugins.map(plugin => loadedPlugins.push(plugin.name))
}

function _routingTree(config) {
  const {scheduledFunctions, routes} = config

  if (scheduledFunctions) {
    scheduledFunctions.length > 0 ? log(chalk.blue.yellow('Available scheduled Functions (' + scheduledFunctions.length + ')')) : null
    scheduledFunctions.map(({description, functionName}) => {
      if (!functionName)
        throw 'No name specified for scheduled Function !'

      log(
        chalk.blue('SCD'),
        chalk.blue(functionName),
        description ? chalk.green(description) : chalk.grey('No description provided'),
      )
    }
    )
  }

  log(chalk.blue.yellow('Available routes (' + Object.keys(routes).length + ')'))

  routes ?
    Object.keys(routes)
      .forEach(key => log(
        chalk.blue(routes[key].method),
        chalk.blue(routes[key].endpoint),
        routes[key].description ? chalk.green('\n' + routes[key].description) : chalk.grey('\n' + 'No description provided'),
        _params(routes[key].params)
                + '\n'))
    : log(chalk.red('No routes defined'));
}

function _params(params) {
  if (!params)
    return ''

  let log = ''
  if (params.required && params.required.length) log += '\n' + chalk.red('required : ')
  if (params.required && params.required.length) params.required.forEach(param => log += chalk.red(param) + ' ')

  if (params.optional && params.optional.length) log += '\n' + chalk.yellow('optional : ')
  if (params.optional && params.optional.length) params.optional.forEach(param => log += chalk.yellow(param) + ' ')


  return log
}

function _events(handler, io) {
  log(chalk.yellow("Socket.io events"))


console.log('pre connect')
  io.on('connection', (socket) => {
    console.log('connect')
    console.log(handler.connect(socket))
  })
  io.on('error', (error) => {
    console.log('error', error)
  })
}

async function _request(plugins, handler, req, res, next, route) {
  let response, result

  const {profiles, name} = route

  if (plugins && plugins.length > 0) {
    let authPlugin = _plugin('auth-plugin', plugins)

    if (!authPlugin)
      return await handler[name](req, res, next)

    const {plugin} = authPlugin

    if (!profiles || !profiles.length)
      log(chalk.bold.yellow('WARNING : Endpoint is registered as public (*) it means that all calls can access to the remote resource. set up an profile by adding profiles: [list] in the yaml config.'))

    result = await plugin.onRequest(req, res, next, profiles)

    if (result.code === 200 && result.request)
      response = await handler[name](result.request, result.response, result.next)

    else return result

  } else {
    response = await handler[name](req, res, next)
  }
  return response
}

function _plugin(name, plugins) {
  //no name provided
  if (!name) {
    log(chalk.red('No plugin ' + name + 'found.'))
    return
  }
  // no plugins in yml
  if (!plugins || !plugins.length) {
    log(chalk.red('No plugins registered in config.yml file. Consider adding plugin in config.yml before require it.'))
    return
  }
  //name does not match plugins
  if (!plugins.filter(plugin => plugin.name === name).length) {
    log(chalk.red('The plugin does not match any provided plugins.'))
    return
  }

  return plugins.filter(plugin => plugin.name === name)[0].plugin
}

module.exports = {
  _compression,
  _routes,
  _requestLogger,
  _plugins,
  _routingTree,
  _currentRoute,
  _resources,
  _port,
  _scheduledFunctions,
  _events,
}
