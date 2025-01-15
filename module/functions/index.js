const amqp = require("amqplib");
const CronJob = require("cron").CronJob;
const path = require("path");
const rateLimiter = require("express-rate-limit");

/**
 * Setup the port if needed
 * @param config yaml config
 * @returns {*} port
 * @private
 */
function port(config) {
  if (process.env.PORT) return process.env.PORT;
  let { port } = config;
  if (!port) {
    port = 8080;
  }
  return port;
}

function resources(service) {
  const app = service.get("app");
  const express = service.get("express");
  const config = service.get("config");

  if (!config.resources) return;
  if (config.resources.viewEngine)
    app.set("view engine", config.resources.viewEngine);

  if (config.resources.storage) {
    Object.keys(config.resources.storage).forEach((key) => {
      app.use(
        config.resources.storage[key],
        express.static(path.join(require.main.filename, "..", key))
      );
    });
  }
}

function runActionsOnStartup(service) {
  const actions = service.get("actions");
  const actionsState = service.get("actionsState");
  const logger = service.get("logger");

  try {
    actionsState.forEach(({ name, id }) => {
      if (actionsState[id].runOnStartup) {
        if (actions.running)
          logger.error(
            `Action ${name} already running, stop it to start it again`
          );

        logger.info(`Action ${name} started`);

        startAction(service, id);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function setupActions(service) {
  const handler = service.get("handler");
  const config = service.get("config");
  const logger = service.get("logger");

  let actions = [];
  let actionsState = [];
  if (config.actions) {
    config.actions.forEach((action, index) => {
      if (!action.cron) logger.warn("No periodicity provided !");
      if (!action.name) throw "No function provided !";

      actions.push({
        id: index,
        action: action.cron
          ? new CronJob(action.cron, async () => {
              await handler[action.name]({
                action,
                publishInternalMessage: (topic, message) =>
                  publishInternalMessage(service, topic, message),
                publishExternalMessage: (topic, message) =>
                  publishExternalMessage(service, topic, message),
              });
            })
          : {
              start: async () =>
                await handler[action.name]({
                  action,
                  publishInternalMessage: (topic, message) =>
                    publishInternalMessage(service, topic, message),
                  publishExternalMessage: (topic, message) =>
                    publishExternalMessage(service, topic, message),
                }),
            },
      });
      actionsState.push({
        id: index,
        name: action.name,
        createdAt: new Date().toISOString(),
        running: false,
        runOnStartup: action.runOnStartup,
      });
    });
  }

  service.set("actions", actions);
  service.set("actionsState", actionsState);
}

function startAction(service, id) {
  try {
    let actions = service.get("actions");
    let actionsState = service.get("actionsState");
    const { action } = actions[id];

    if (actionsState[id].running)
      throw "Action already running, stop it to start it again";

    action.start();
    actionsState[id].running = true;

    service.set("actionsState", actionsState);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function stopAction(service, id) {
  try {
    const actions = service.get("actions");
    let actionsState = service.get("actionsState");
    const { action } = actions[id];

    if (!actionsState[id].running)
      throw "Action not running, start it to stop it again";

    action.stop();
    actionsState[id].running = false;

    service.set("actionsState", actionsState);
  } catch (e) {
    throw e;
  }
}

function listActions(service) {
  return service.get("actionsState");
}

function currentRoute(microservice, logger) {
  microservice.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    if (req.path === "/") return res.sendStatus(403);
    return next();
  });
}

function tree(service) {
  const config = service.get("config");
  const logger = service.get("logger");

  const { actions, routes, messaging } = config;

  if (actions) {
    if (!actions.length) {
      logger.error("No actions defined");
      return;
    }

    logger.info("Available scheduled actions (" + actions.length + ")");

    actions.forEach((action) => {
      if (!action) throw "No name specified for scheduled Function !";

      logger.info(
        [
          "Action ",
          action.name,
          action.description ? action.description : "No description provided",
        ].join(" ")
      );
    });
  }
  if (routes) {
    if (!routes.length) {
      logger.info("No routes defined");
      return;
    }
    logger.info("Available routes (" + Object.keys(routes).length + ")");

    routes.forEach((route) =>
      logger.info(
        [
          route.method,
          route.endpoint,
          route.description
            ? "\n" + route.description
            : "\n" + "No description provided",
          params(route.params) + "\n",
        ].join(" ")
      )
    );
  }

  if (messaging.internal) {
    if (messaging.internal.events) {
      if (!messaging.internal.events.length) {
        logger.info.error("No internal events defined");
        return;
      }
      messaging.internal.events.forEach((event) =>
        logger.info(
          [
            event.name,
            event.description
              ? "\n" + event.description
              : "\n" + "No description provided" + "\n",
          ].join(" ")
        )
      );
    }
  }
  if (messaging.external) {
    if (messaging.external.events) {
      if (!messaging.external.events.length) {
        logger.info.error("No events external defined");
        return;
      }
      messaging.internal.events.forEach((event) =>
        logger.info(
          [
            event.name,
            event.description
              ? "\n" + event.description
              : "\n" + "No description provided" + "\n",
          ].join(" ")
        )
      );
    }
  }
}

function params(params) {
  if (!params) return "";

  let log = "";
  if (params.required && params.required.length) log += "\n" + "required : ";
  if (params.required && params.required.length)
    params.required.forEach((param) => (log += param + " "));

  if (params.optional && params.optional.length) log += "\n" + "optional : ";
  if (params.optional && params.optional.length)
    params.optional.forEach((param) => (log += param + " "));

  return log;
}

async function request(microservice, route) {
  const logger = microservice.get("logger");

  try {
    const http = microservice.get("http");

    return await http(microservice, route);
  } catch (e) {
    logger.error(e.toString());
  }
}

function redisSession(service) {
  const config = service.get("config");
  const logger = service.get("logger");
  if (!config.session) return;

  const app = service.get("app");
  const session = require("express-session");
  const RedisStore = require("connect-redis")(session);
  const { createClient } = require("redis");
  const redisClient = createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
    password: process.env.REDIS_PASSWORD || "",
    legacyMode: true, // NOTE: important
  });
  redisClient
    .connect()
    .then(() => logger.info("Redis connected"))
    .catch(console.error);

  const sess = {
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
      client: redisClient,
      logErrors: true,
      ttl: 10, // in seconds
    }),
    cookie: {
      maxAge: 10000,
    },
  };
  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sess));
}

function rateLimit(service, duration = 15 * 60 * 1000, limit = 10000) {
  const app = service.get("app");

  const limiter = rateLimiter({
    windowMs: duration,
    max: limit,
    standardHeaders: true,
    message: "TooManyRequests",
  });
  app.use(limiter);
}

async function messaging(service) {
  const logger = service.get("logger");
  try {
    const handler = service.get("handler");
    const server = service.get("server");
    const config = service.get("config");
    const clients = service.get("clients");
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: process.env.RABBITMQ_PORT || 5672,
      username: process.env.RABBITMQ_USER || "guest",
      password: process.env.RABBITMQ_PASSWORD || "<PASSWORD>",
      vhost: process.env.RABBITMQ_VHOST || "/",
      heartbeat: 10,
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });
    logger.info("Amqp connected");
    const channel = await connection.createChannel();
    service.set("channel", channel);

    if (config.messaging) {
      // setup amqp
      if (config.messaging.internal) {
        for (const queue of config.messaging.internal.events) {
          await channel.assertQueue(queue.name);
          await channel.consume(
            queue.name,
            (message) => {
              const content = message.content.toString();
              logger.info(
                `[${config.name}] Getting Event [${queue.name}] <- From event source`
              );
              if (!handler[queue]) {
                logger.error(
                  `[${config.name}] Getting Event [${queue.name}] <- From event source`
                );
              }
              handler[queue](content, channel);
            },
            { noAck: false }
          );
        }
      }
      // setup websockets
      if (config.messaging.external) {
        const io = require("socket.io")(server, {
          transports: ["websocket"],
          cookie: true,
          secure: true,

          cors: {
            origin: "*",
            methods: ["GET", "POST"],
          },
        });

        io.on("connection", (client) => {
          logger.info(`New connection`);
          const query = client.handshake.query;

          const { clientType, client: name } = query;

          if (clientType) {
            if (
              query &&
              (clientType === "service" ||
                clientType === "application" ||
                clientType === "service-" ||
                clientType === "application-")
            ) {
              // add client to connections

              clients.set(name, client);
              const connected = clients.get(name);

              if (connected) {
                logger.info(
                  `Client ${name} not connected, update client reference (connection update)`
                );
                logger.info(
                  ["Connected clients", clients.size, clients.keys()].join(" ")
                );
                connected.leave("event-room");
              }

              // update client
              connected.join("event-room");

              // PubSub to be used in the app
              if (
                (config.messaging.external.events &&
                  config.messaging.external.events.length) > 0
              ) {
                logger.info(`${config.events.length} events to register`);
                for (const event of config.messaging.external.events) {
                  logger.info(`Registering event ${event.name}`);
                  connected.on(event.name, (data) =>
                    handler[event.name](io, client, data)
                  );
                }
              }

              connected.on("disconnect", (reason) => {
                // remove client to connections
                if (name) {
                  connected.leave("event-room");
                  logger.info(
                    ["Disconnected", name, "reason", reason].join(" ")
                  );
                  clients.delete(name);
                  service.set("clients", clients.keys());
                  logger.info(["Connected clients", clients.size].join(" "));
                }
              });
            }
          }
        });
        service.set("socket", io);
      }
    }
  } catch (e) {
    logger.error(e);
  }
}

async function publishExternalMessage(service, topic = "event", message = {}) {
  const socket = service.get("socket");
  const config = service.get("config");

  if (!socket) return;

  try {
    socket.emit(topic, {
      ...message,
      source: config.name,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.log(e);
  }
}

async function publishInternalMessage(service, topic = "event", message = {}) {
  const channel = service.get("channel");

  try {
    await channel.assertQueue(topic);
    channel.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
}

function routes(service) {
  const config = service.get("config");
  const logger = service.get("logger");
  if (config.routes) config.routes.forEach((route) => request(service, route));
  else logger.error("no appRoutes");
}

module.exports = {
  rateLimit,
  redisSession,
  tree,
  currentRoute,
  resources,
  port,
  setupActions,
  runActionsOnStartup,
  publishInternalMessage,
  publishExternalMessage,
  listActions,
  startAction,
  stopAction,
  messaging,
  routes,
};
