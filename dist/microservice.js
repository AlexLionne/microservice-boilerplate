"use strict";
const winston = require("winston");
const cors = require("cors");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
const { createLogger, transports, format } = require("winston");
const { combine, colorize, timestamp, printf } = winston.format;
const whitelist = [
    "http://localhost:3000",
    "http://192.168.1.12",
    "http://lnl2131a.com",
    "https://lnl2131a.com",
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error(`${origin} Blocked`));
        }
    },
    credentials: true,
};
let logger = {};
logger = createLogger({
    level: "info",
    format: combine(format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss",
    }), format.colorize(), timestamp(), printf((info) => {
        return `${info.timestamp} [${info.level}] : ${JSON.stringify(info.message)}`;
    })),
    transports: [new transports.Console()],
});
if (process.env.NODE_ENV === "production" && process.env.LOGTAIL_TOKEN) {
    const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
    logger = winston.createLogger({
        format: combine(colorize({ message: true })),
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
const { rateLimit, tree, setupActions, runActionsOnStartup, currentRoute, resources, port, messaging, routes, redisSession, } = require("./functions");
currentRoute(app, logger);
app.use(cors(corsOptions));
app.use(body.urlencoded({ limit: "5mb", extended: true }));
app.use(body.json({ limit: "5mb" }));
app.use(formData.parse({ autoClean: true }));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(compression());
if (process.env.NODE_ENV === "development")
    app.disable("etag");
const { http } = require("./http");
function microservice(options) {
    let config = options || null;
    if (!config) {
        logger.error("No configuration file for Microservice(config)");
        throw "No configuration file for microservice";
    }
    const handler = require(path.join(require.main.filename, config.functions));
    let microservice = new Map();
    microservice.set("variables", new Map());
    microservice.set("logger", logger);
    microservice.set("app", app);
    microservice.set("clients", new Map());
    microservice.set("express", express);
    microservice.set("server", server);
    microservice.set("http", http);
    microservice.set("handler", handler);
    microservice.set("actions", []);
    microservice.set("actionsState", []);
    microservice.set("config", config);
    tree(microservice);
    function stop() {
        get("server").close();
        return new Date().toISOString();
    }
    function get(tag = "*") {
        if (tag === "*") {
            return microservice;
        }
        else {
            return microservice.get(tag);
        }
    }
    async function start() {
        const appPort = port(config);
        await messaging(microservice);
        redisSession(microservice);
        rateLimit(microservice);
        resources(microservice);
        setupActions(microservice);
        runActionsOnStartup(microservice);
        routes(microservice);
        if (process.env.NODE_ENV === "development") {
            server.listen(parseInt(appPort), "0.0.0.0", () => logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`));
        }
        else {
            server.listen(parseInt(appPort), () => logger.info(`Running ${process.env.NODE_ENV} on ${parseInt(appPort)}`));
        }
        return new Date().toISOString();
    }
    return { start, stop, get };
}
module.exports = microservice;
//# sourceMappingURL=microservice.js.map