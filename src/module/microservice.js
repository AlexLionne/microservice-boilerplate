"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
/// todo handle session
if (process.env.NODE_ENV === "development")
    app.disable("etag");
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
        }
        else {
            return microservice.get(tag);
        }
    }
    // start server
    function start() {
        return __awaiter(this, void 0, void 0, function* () {
            const appPort = port(config);
            yield messaging(microservice);
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
        });
    }
    return { start, stop, get };
}
module.exports = microservice;
