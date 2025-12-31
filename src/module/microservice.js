const winston = require('winston')
const { Logtail } = require('@logtail/node')
const { LogtailTransport } = require('@logtail/winston')
const { createLogger, transports, format } = require('winston')
const { combine, colorize, timestamp, printf } = winston.format
const cors = require('cors')
let logger = {}

logger = createLogger({
  level: 'info',
  format: combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss',
    }),
    format.colorize(),
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.level}] : ${JSON.stringify(
        info.message
      )}`
    })
  ),
  transports: [new transports.Console()],
})

if (process.env.NODE_ENV === 'production' && process.env.LOGTAIL_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN)
  logger = winston.createLogger({
    format: combine(colorize({ message: true })),
    transports: [new LogtailTransport(logtail)],
  })
}

const formData = require('express-form-data')
const express = require('express')
const body = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const app = express()
const compression = require('compression')
require('dotenv').config()

const server = require('http').createServer(app)

const {
  rateLimit,
  tree,
  setupActions,
  runActionsOnStartup,
  currentRoute,
  resources,
  port,
  messaging,
  routes,
  redisSession,
} = require('./functions')

currentRoute(app, logger)
app.use(cors({
  origin: [
    'https://portal.lnl2131a.com',
    'https://jade.lnl2131a.com',
    'https://admin.lnl2131a.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.options('*', cors());
app.use(cookieParser());
app.use(body.urlencoded({ limit: '5mb', extended: true }))
app.use(body.json({ limit: '5mb' }))
app.use(formData.parse({ autoClean: true }))
app.use(formData.format())
app.use(formData.stream())
app.use(formData.union())
app.use(compression())

/// todo handle session
if (process.env.NODE_ENV === 'development') app.disable('etag')

const { http } = require('./http')

/**
 * Microservice module
 *
 * handle express app with an yml configuration
 * @param options yml (readable as jspn) configuration file
 */

function microservice (options) {
  let config = options || null

  if (!config) {
    logger.error('No configuration file for Microservice(config)')
    throw 'No configuration file for microservice'
  }

  const handler = require(path.join(require.main.filename, config.functions))
  let microservice = new Map()

  /**
   * State Manager
   */
  // app variables
  microservice.set('variables', new Map())
  // logtail loger
  microservice.set('logger', logger)
  // express app instance
  microservice.set('app', app)
  // socket clients
  microservice.set('clients', new Map())
  // express instance
  microservice.set('express', express)
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
  function stop () {
    get('server').close()
    return new Date().toISOString()
  }

  // get store
  function get (tag = '*') {
    if (tag === '*') {
      return microservice
    } else {
      return microservice.get(tag)
    }
  }

  // start server
  async function start () {
    const appPort = port(config)
    await messaging(microservice)
    redisSession(microservice)
    rateLimit(microservice)
    resources(microservice)
    setupActions(microservice)
    runActionsOnStartup(microservice)
    routes(microservice)

    if (process.env.NODE_ENV === 'development') {
      server.listen(parseInt(appPort), '0.0.0.0', () =>
        logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`)
      )
    } else {
      server.listen(parseInt(appPort), () =>
        logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`)
      )
    }

    return new Date().toISOString()
  }

  return { start, stop, get }
}

module.exports = microservice
