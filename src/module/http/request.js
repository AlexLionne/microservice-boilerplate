const {
  startAction,
  stopAction,
  listActions,
  publishInternalMessage,
  publishExternalMessage,
  waitForMessage,
} = require("../functions");
const security = require('cors')

module.exports = function http(service, route) {
  const microservice = service.get("app");
  const handler = service.get("handler");
  const logger = service.get("logger");

  const { endpoint, method, name, middlewares, cors } = route;

  if (
    !endpoint ||
    !endpoint.includes("/") ||
    !["get", "post", "put", "delete", "options", "option", "patch"].includes(
      method.toLowerCase()
    )
  )
    return logger.info(
      "Check endpoint configuration nor method used in the configuration file"
    );

  // handle middlewares
  let actions = [];
  if (middlewares && middlewares.length) {
    for (const middleware of middlewares) {
      if (!handler[middleware])
        throw `[${middleware}] - No handler for this middleware`;

      actions.push((req, res, next) => handler[middleware](req, res, next));
    }
  }

  async function middleware(req, res, next) {
    try {
      if (!handler[name]) {
        logger.error("No functions associated with this route");
        logger.error("Handler could be null to");
      }
      await handler[name](req, res, next);
    } catch (e) {
      logger.error(e);
      return res.status(500).send();
    }
  }

  function loggerMiddleware(req, res, next) {
    const logger = service.get("logger");
    req.logger = logger;
    next();
  }

  function actionManager(req, res, next) {
    req.actionManager = {
      start: (id) => startAction(service, id),
      stop: (id) => stopAction(service, id),
      actions: () => listActions(service),
    };
    next();
  }

  function socketServer(req, res, next) {
    req.socketServer = service.get("socket");
    next();
  }

  function corsHandler(req, res, next) {
    const whitelist = [
      "http://192.168.1.12",
      "https://lnl2131a.com",
      "https://api.auth.lnl2131a.com",
      "https://api.home.lnl2131a.com",
      "https://portal.lnl2131a.com",
      "https://jade.lnl2131a.com",
    ];
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} Blocked`));
        }
      },
      credentials: true,
    };
    if (cors === false) next()
    return security(corsOptions);
  }
  /**
   * Global variables tat can be set in the app
   * @param req
   * @param res
   * @param next
   */
  function variables(req, res, next) {
    req.variables = service.get("variables");
    next();
  }

  function messaging(req, res, next) {
    req.messaging = {
      waitForMessage: (topic, cb) => waitForMessage(service, topic, cb),
      publishInternalMessage: (topic, message) =>
        publishInternalMessage(service, topic, message),
      publishExternalMessage: (topic, message) =>
        publishExternalMessage(service, topic, message),
    };

    next();
  }

  // send event
  try {
    microservice[method.toLowerCase()](
      endpoint,
      corsHandler,
      variables,
      loggerMiddleware,
      socketServer,
      actionManager,
      messaging,
      actions,
      middleware
    );
  } catch (e) {
    logger.error(e);
    return e.message;
  }
};
