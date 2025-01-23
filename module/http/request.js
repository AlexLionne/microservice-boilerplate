const {
  startAction,
  stopAction,
  listActions,
  publishInternalMessage,
  publishExternalMessage,
  waitForMessage,
} = require("../functions");

module.exports = function http(service, route) {
  const microservice = service.get("app");
  const handler = service.get("handler");
  const logger = service.get("logger");

  const { endpoint, method, name, middlewares } = route;

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
    if (method.toLowerCase() === "get")
      microservice.get(
        endpoint,
        loggerMiddleware,
        socketServer,
        actionManager,
        messaging,
        actions,
        middleware
      );
    if (method.toLowerCase() === "post")
      microservice.post(
        endpoint,
        loggerMiddleware,
        socketServer,
        actionManager,
        messaging,
        actions,
        middleware
      );
    if (method.toLowerCase() === "put")
      microservice.put(
        endpoint,
        loggerMiddleware,
        socketServer,
        actionManager,
        messaging,
        actions,
        middleware
      );
    if (method.toLowerCase() === "delete")
      microservice.delete(
        endpoint,
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
