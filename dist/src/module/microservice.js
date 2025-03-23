function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var winston = require("winston");
var cors = require("cors");
var Logtail = require("@logtail/node").Logtail;
var LogtailTransport = require("@logtail/winston").LogtailTransport;
var _require = require("winston"), createLogger = _require.createLogger, transports = _require.transports, format = _require.format;
var _winston_format = winston.format, combine = _winston_format.combine, colorize = _winston_format.colorize, timestamp = _winston_format.timestamp, printf = _winston_format.printf;
var whitelist = [
    "http://localhost:3000",
    "http://192.168.1.12",
    "http://lnl2131a.com",
    "https://lnl2131a.com"
];
var corsOptions = {
    origin: function origin(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("".concat(origin, " Blocked")));
        }
    },
    credentials: true
};
var logger = {};
logger = createLogger({
    level: "info",
    format: combine(format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss"
    }), format.colorize(), timestamp(), printf(function(info) {
        return "".concat(info.timestamp, " [").concat(info.level, "] : ").concat(JSON.stringify(info.message));
    })),
    transports: [
        new transports.Console()
    ]
});
if (process.env.NODE_ENV === "production" && process.env.LOGTAIL_TOKEN) {
    var logtail = new Logtail(process.env.LOGTAIL_TOKEN);
    logger = winston.createLogger({
        format: combine(colorize({
            message: true
        })),
        transports: [
            new LogtailTransport(logtail)
        ]
    });
}
var formData = require("express-form-data");
var express = require("express");
var body = require("body-parser");
var path = require("path");
var app = express();
var compression = require("compression");
require("dotenv").config();
var server = require("http").createServer(app);
var _require1 = require("./functions"), rateLimit = _require1.rateLimit, tree = _require1.tree, setupActions = _require1.setupActions, runActionsOnStartup = _require1.runActionsOnStartup, currentRoute = _require1.currentRoute, resources = _require1.resources, port = _require1.port, messaging = _require1.messaging, routes = _require1.routes, redisSession = _require1.redisSession;
currentRoute(app, logger);
app.use(cors(corsOptions));
app.use(body.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(body.json({
    limit: "5mb"
}));
app.use(formData.parse({
    autoClean: true
}));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(compression());
/// todo handle session
if (process.env.NODE_ENV === "development") app.disable("etag");
var http = require("./http").http;
/**
 * Microservice module
 *
 * handle express app with an yml configuration
 * @param options yml (readable as jspn) configuration file
 */ function microservice(options) {
    var config = options || null;
    if (!config) {
        logger.error("No configuration file for Microservice(config)");
        throw "No configuration file for microservice";
    }
    var handler = require(path.join(require.main.filename, config.functions));
    var _$microservice = new Map();
    /**
   * State Manager
   */ // app variables
    _$microservice.set("variables", new Map());
    // logtail loger
    _$microservice.set("logger", logger);
    // express app instance
    _$microservice.set("app", app);
    // socket clients
    _$microservice.set("clients", new Map());
    // express instance
    _$microservice.set("express", express);
    // http server instance
    _$microservice.set("server", server);
    // http middlewares
    _$microservice.set("http", http);
    // static functions
    _$microservice.set("handler", handler);
    // scheduled actions
    _$microservice.set("actions", []);
    // scheduled actions state wrapper
    _$microservice.set("actionsState", []);
    // microservice config
    _$microservice.set("config", config);
    // log the route tree
    tree(_$microservice);
    // stop server
    function stop() {
        get("server").close();
        return new Date().toISOString();
    }
    // get store
    function get() {
        var tag = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "*";
        if (tag === "*") {
            return _$microservice;
        } else {
            return _$microservice.get(tag);
        }
    }
    function start() {
        return _start.apply(this, arguments);
    }
    function _start() {
        _start = // start server
        _async_to_generator(function() {
            var appPort;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        appPort = port(config);
                        return [
                            4,
                            messaging(_$microservice)
                        ];
                    case 1:
                        _state.sent();
                        redisSession(_$microservice);
                        rateLimit(_$microservice);
                        resources(_$microservice);
                        setupActions(_$microservice);
                        runActionsOnStartup(_$microservice);
                        routes(_$microservice);
                        if (process.env.NODE_ENV === "development") {
                            server.listen(parseInt(appPort), "0.0.0.0", function() {
                                return logger.info("Running ".concat(process.env.NODE_ENV, " on ").concat(parseInt(appPort)));
                            });
                        } else {
                            server.listen(parseInt(appPort), function() {
                                return logger.info("Running ".concat(process.env.NODE_ENV, " on ").concat(parseInt(appPort)));
                            });
                        }
                        return [
                            2,
                            new Date().toISOString()
                        ];
                }
            });
        });
        return _start.apply(this, arguments);
    }
    return {
        start: start,
        stop: stop,
        get: get
    };
}
module.exports = microservice;
