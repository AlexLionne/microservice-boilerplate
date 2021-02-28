let express, body, cors, path, microserver, log, chalk, moment, io, formData;
formData = require('express-form-data');
express = require('express');
body = require('body-parser');
cors = require('cors');
path = require('path');
microserver = express();

microserver.use(body.urlencoded({limit: '5mb', extended: true}));
microserver.use(body.json({limit: '5mb'}))
microserver.use(formData.parse({autoClean: true}));
microserver.use(formData.format());
microserver.use(formData.stream());
microserver.use(formData.union());

const server = require('http').createServer(microserver);
log = console.log;
chalk = require('chalk')
moment = require('moment')
io = require('socket.io')(server)

const {
  _plugins,
  _routingTree,
  _scheduledFunctions,
  _currentRoute,
  _resources,
  _port,
  _routes,
  _events,
  _requestLogger,
  _compression
} = require('./functions')

_compression(microserver)
_requestLogger(microserver)
_currentRoute(microserver)

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
    let {resources, routes, port, scheduledFunctions} = config

    _resources(resources)
    _routes(microserver, routes, handleRequests, cors, handler, plugins, log)
    _events(handler, io)


    port = _port(config)
    jobs = _scheduledFunctions(scheduledFunctions, handler)

    server.listen(port, () => {
      log(
        chalk.bold.green(config.name) + chalk.reset(' running on ') + port
      )
    })


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
