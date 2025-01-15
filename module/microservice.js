const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
let logger = {};
const { combine, timestamp, printf, colorize, align } = winston.format;
if (process.env.LOGTAIL_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
  logger = winston.createLogger({
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new LogtailTransport(logtail)],
  });
}

const formData = require("express-form-data");
const express = require("express");
const body = require("body-parser");
const path = require("path");
const app = express();
const compression = require("compression");
require("dotenv").config();

const server = require("http").createServer(app);

const {
  rateLimit,
  tree,
  setupActions,
  runActionsOnStartup,
  currentRoute,
  resources,
  port,
  socket,
  routes,
  redisSession,
} = require("./functions");

currentRoute(app, logger);

app.use(body.urlencoded({ limit: "5mb", extended: true }));
app.use(body.json({ limit: "5mb" }));
app.use(formData.parse({ autoClean: true }));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(compression());

/// todo handle session
if (process.env.NODE_ENV === "development") app.disable("etag");

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept, Authorization, Origin"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const { http } = require("./http");

/**
 * Microservice module
 *
 * handle express app with an yml configuration
 * @param options yml (readable as jspn) configuration file
 */

function microservice(options) {
  let config = options || null;

  if (!config) {
    logger.error("No configuration file for Microservice(config)");
    throw "No configuration file for microservice";
  }

  const handler = require(path.join(require.main.filename, config.functions));

  let microservice = new Map();

  /**
   * State Manager
   */
  // logtail loger
  microservice.set("logger", logger);
  // express app instance
  microservice.set("app", app);
  // socket clients
  microservice.set("clients", new Map());
  // express instance
  microservice.set("express", express);
  // http server instance
  microservice.set("server", server);
  // http middlewares
  microservice.set("http", http);
  // static functions
  microservice.set("handler", handler);
  // scheduled actions
  microservice.set("actions", []);
  // scheduled actions state wrapper
  microservice.set("actionsState", []);
  // microservice config
  microservice.set("config", config);
  // log the route tree
  tree(microservice);

  // stop server
  function stop() {
    get("server").close();
    return new Date().toISOString();
  }

  // get store
  function get(tag = "*") {
    if (tag === "*") {
      return microservice;
    } else {
      return microservice.get(tag);
    }
  }

  // start server
  function start() {
    const appPort = port(config);

    redisSession(microservice);
    rateLimit(microservice);
    resources(microservice);
    socket(microservice);
    setupActions(microservice);
    runActionsOnStartup(microservice);
    routes(microservice);

    if (process.env.NODE_ENV === "development") {
      server.listen(parseInt(appPort), "0.0.0.0", () =>
        logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`)
      );
    } else {
      server.listen(parseInt(appPort), () =>
        logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`)
      );
    }

    return new Date().toISOString();
  }

  return { start, stop, get };
}

module.exports = microservice;
