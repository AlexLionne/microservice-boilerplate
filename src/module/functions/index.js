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
  const variables = service.get("variables");

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
                variables,
                waitForMessage: (topic, cb) =>
                  waitForMessage(service, topic, cb),
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
                  variables,
                  waitForMessage: (topic, cb) =>
                    waitForMessage(service, topic, cb),
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

  if (messaging) {
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
      if (messaging.external.mqtt) {
        if (messaging.external.mqtt.events) {
          if (!messaging.external.mqtt.events.length) {
            logger.info.error("No mqtt events defined");
            return;
          }
          messaging.external.mqtt.events.forEach((event) =>
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
      if (messaging.external.socket) {
        if (messaging.external.socket.events) {
          if (!messaging.external.socket.events.length) {
            logger.info.error("No socket events defined");
            return;
          }
          messaging.external.socket.events.forEach((event) =>
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
  let redisClient;
  if (!config.session) return;

  const app = service.get("app");
  const session = require("express-session");
  const RedisStore = require("connect-redis")(session);
  const { createClient } = require("redis");
  if (process.env.NODE_ENV === "development") {
    redisClient = createClient({
      legacyMode: true,
      socket: {
        host: process.env.REDIS_HOST || "redis",
        port: process.env.REDIS_PORT || 6379,
      },
    });
  } else {
    redisClient = createClient({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || "",
      legacyMode: true,
    });
  }
  redisClient
    .connect()
    .then(() => logger.info("[SERVER] Redis connected"))
    .catch(console.error);

  const sess = {
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      logErrors: true,
      ttl: 7 * 24 * 60 * 60,
      stringify: (data) => {
        try {
          return JSON.stringify(data);
        } catch (e) {
          logger.error("Erreur sérialisation session:", e);
          return "{}";
        }
      },
      parse: JSON.parse,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,  // en ms pour cookie
      httpOnly: true,
      sameSite: "none",
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
    const variables = service.get("variables");
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

    const io = require("socket.io")(server, {
      transports: ["websocket"],
      cookie: true,
      secure: true,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

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
              if (!handler[queue.name]) {
                logger.error(
                  `[${config.name}] Getting Event [${queue.name}] <- From event source`
                );
              }
              if (handler[queue.name]) {
                handler[queue.name](
                  {
                    server: io,
                    socket: null,
                    logger,
                    variables,
                    waitForMessage: (topic, cb) =>
                      waitForMessage(service, topic, cb),
                    publishInternalMessage: (topic, message) =>
                      publishInternalMessage(service, topic, message),
                    publishExternalMessage: (topic, message) =>
                      publishExternalMessage(service, topic, message),
                  },
                  content
                );
              }
            },
            { noAck: true }
          );
        }
      }

      // setup websockets
      if (config.messaging.external) {
        if (config.messaging.external.mqtt) {
          // setup Mqtt
          const client = require("mqtt").connect(process.env.MQTT_URL, {
            hostname: process.env.MQTT_HOST || "localhost",
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
          });
          // PubSub to be used in the app
          if (
            (config.messaging.external.mqtt.events &&
              config.messaging.external.mqtt.events.length) > 0
          ) {
            logger.info(
              `${config.messaging.external.mqtt.events.length} mqtt events to register`
            );
            for (const event of config.messaging.external.mqtt.events) {
              logger.info(`Registering event ${event.name}`);
              client.on(event.name, (topic, message) =>
                handler[event.name](
                  {
                    server: io,
                    socket: client,
                    variables,
                    waitForMessage: (topic, cb) =>
                      waitForMessage(service, topic, cb),
                    publishInternalMessage: (topic, message) =>
                      publishInternalMessage(service, topic, message),
                    publishExternalMessage: (topic, message) =>
                      publishExternalMessage(service, topic, message),
                  },
                  topic,
                  message
                )
              );
            }
          }
          service.set("mqtt", client);
        }

        if (config.messaging.external.socket) {
          io.on("connection", (client) => {
            logger.info(`[SERVER] New connection`);
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
                    ["Connected clients", clients.size, clients.keys()].join(
                      " "
                    )
                  );
                  connected.leave("event-room");
                }

                // update client
                connected.join("event-room");

                if (
                  (config.messaging.external.socket.events &&
                    config.messaging.external.socket.events.length) > 0
                ) {
                  logger.info(
                    `${config.messaging.external.socket.events.length} socket events to register`
                  );
                  for (const event of config.messaging.external.socket.events) {
                    logger.info(`Registering event ${event.name}`);
                    connected.on(event.name, (data, callback) => {
                      logger.info(`recieved event ${event.name}`);
                      logger.info(`hasData ${data === undefined}`);
                      logger.info(`hasCallback ${callback === undefined}`);
                      handler[event.name](
                        {
                          server: io,
                          socket: client,
                          variables,
                          waitForMessage: (topic, cb) =>
                            waitForMessage(service, topic, cb),
                          publishInternalMessage: (topic, message) =>
                            publishInternalMessage(service, topic, message),
                          publishExternalMessage: (topic, message) =>
                            publishExternalMessage(service, topic, message),
                        },
                        data,
                        callback
                      );
                    });
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
    }
  } catch (e) {
    logger.error(e);
  }
}

async function publishMQTTtMessage(service, topic = "event", message = {}) {
  const mqtt = service.get("mqtt");
  const config = service.get("config");
  if (!mqtt) return;

  const payload = {
    ...message,
    source: config.name,
    sentAt: new Date().toISOString(),
  };
  mqtt.publish(topic, JSON.stringify(payload));
}

async function publishSocketMessage(service, topic = "event", message = {}) {
  const socket = service.get("socket");
  const config = service.get("config");

  if (!socket) return;

  if (!topic) throw new Error("No topic provided");

  const payload = {
    ...message,
    source: config.name,
    sentAt: new Date().toISOString(),
  };

  if (topic.includes(":")) {
    const [type, room, event] = topic.split(":");
    if (type === "room") {
      socket.sockets.in(room).emit(event, payload);
    } else {
      socket.emit(event, payload);
    }
  } else {
    socket.emit(topic, payload);
  }
}

async function publishExternalMessage(
  service,
  topic = "socket://event:event",
  message = {}
) {
  const [serviceType, target] = topic.split("://");
  try {
    if (!serviceType) return;
    if (serviceType === "mqtt")
      return publishMQTTtMessage(service, target, message);
    if (serviceType === "socket")
      return publishSocketMessage(service, target, message);
  } catch (e) {
    console.log(e);
  }
}

function waitForMessage(service, topic, cb) {
  const channel = service.get("channel");
  const logger = service.get("logger");

  channel.assertQueue(topic);
  if (!topic) {
    logger.error("No topic provided");
    return;
  }
  try {
    channel.consume(
      topic,
      (message) => {
        logger.info(`[SERVER] Getting message from topic ${topic}`);
        cb(message.content.toString());
      },
      {
        noAck: true,
      }
    );
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
  waitForMessage,
  publishInternalMessage,
  publishExternalMessage,
  listActions,
  startAction,
  stopAction,
  messaging,
  routes,
};
