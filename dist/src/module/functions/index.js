"use strict";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
function _ts_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return _instanceof(value, P) ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var amqp = require("amqplib");
var CronJob = require("cron").CronJob;
var path = require("path");
var rateLimiter = require("express-rate-limit");
/**
 * Setup the port if needed
 * @param config yaml config
 * @returns {*} port
 * @private
 */ function port(config) {
    if (process.env.PORT) return process.env.PORT;
    var _$port = config.port;
    if (!_$port) {
        _$port = 8080;
    }
    return _$port;
}
function resources(service) {
    var app = service.get("app");
    var express = service.get("express");
    var config = service.get("config");
    if (!config.resources) return;
    if (config.resources.viewEngine) app.set("view engine", config.resources.viewEngine);
    if (config.resources.storage) {
        Object.keys(config.resources.storage).forEach(function(key) {
            app.use(config.resources.storage[key], express.static(path.join(require.main.filename, "..", key)));
        });
    }
}
function runActionsOnStartup(service) {
    var actions = service.get("actions");
    var actionsState = service.get("actionsState");
    var logger = service.get("logger");
    try {
        actionsState.forEach(function(param) {
            var name = param.name, id = param.id;
            if (actionsState[id].runOnStartup) {
                if (actions.running) logger.error("Action ".concat(name, " already running, stop it to start it again"));
                logger.info("Action ".concat(name, " started"));
                startAction(service, id);
            }
        });
    } catch (e) {
        console.log(e);
    }
}
function setupActions(service) {
    var _this = this;
    var handler = service.get("handler");
    var config = service.get("config");
    var logger = service.get("logger");
    var actions = [];
    var actionsState = [];
    if (config.actions) {
        config.actions.forEach(function(action, index) {
            if (!action.cron) logger.warn("No periodicity provided !");
            if (!action.name) throw "No function provided !";
            actions.push({
                id: index,
                action: action.cron ? new CronJob(action.cron, function() {
                    return __awaiter(_this, void 0, void 0, function() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        handler[action.name]({
                                            action: action,
                                            waitForMessage: function(topic, cb) {
                                                return waitForMessage(service, topic, cb);
                                            },
                                            publishInternalMessage: function(topic, message) {
                                                return publishInternalMessage(service, topic, message);
                                            },
                                            publishExternalMessage: function(topic, message) {
                                                return publishExternalMessage(service, topic, message);
                                            }
                                        })
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    });
                }) : {
                    start: function() {
                        return __awaiter(_this, void 0, void 0, function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            handler[action.name]({
                                                action: action,
                                                waitForMessage: function(topic, cb) {
                                                    return waitForMessage(service, topic, cb);
                                                },
                                                publishInternalMessage: function(topic, message) {
                                                    return publishInternalMessage(service, topic, message);
                                                },
                                                publishExternalMessage: function(topic, message) {
                                                    return publishExternalMessage(service, topic, message);
                                                }
                                            })
                                        ];
                                    case 1:
                                        return [
                                            2,
                                            _state.sent()
                                        ];
                                }
                            });
                        });
                    }
                }
            });
            actionsState.push({
                id: index,
                name: action.name,
                createdAt: new Date().toISOString(),
                running: false,
                runOnStartup: action.runOnStartup
            });
        });
    }
    service.set("actions", actions);
    service.set("actionsState", actionsState);
}
function startAction(service, id) {
    try {
        var actions = service.get("actions");
        var actionsState = service.get("actionsState");
        var action = actions[id].action;
        if (actionsState[id].running) throw "Action already running, stop it to start it again";
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
        var actions = service.get("actions");
        var actionsState = service.get("actionsState");
        var action = actions[id].action;
        if (!actionsState[id].running) throw "Action not running, start it to stop it again";
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
    microservice.use(function(req, res, next) {
        logger.info("".concat(req.method, " ").concat(req.path));
        if (req.path === "/") return res.sendStatus(403);
        return next();
    });
}
function tree(service) {
    var config = service.get("config");
    var logger = service.get("logger");
    var actions = config.actions, _$routes = config.routes, _$messaging = config.messaging;
    if (actions) {
        if (!actions.length) {
            logger.error("No actions defined");
            return;
        }
        logger.info("Available scheduled actions (" + actions.length + ")");
        actions.forEach(function(action) {
            if (!action) throw "No name specified for scheduled Function !";
            logger.info([
                "Action ",
                action.name,
                action.description ? action.description : "No description provided"
            ].join(" "));
        });
    }
    if (_$routes) {
        if (!_$routes.length) {
            logger.info("No routes defined");
            return;
        }
        logger.info("Available routes (" + Object.keys(_$routes).length + ")");
        _$routes.forEach(function(route) {
            return logger.info([
                route.method,
                route.endpoint,
                route.description ? "\n" + route.description : "\n" + "No description provided",
                params(route.params) + "\n"
            ].join(" "));
        });
    }
    if (_$messaging) {
        if (_$messaging.internal) {
            if (_$messaging.internal.events) {
                if (!_$messaging.internal.events.length) {
                    logger.info.error("No internal events defined");
                    return;
                }
                _$messaging.internal.events.forEach(function(event) {
                    return logger.info([
                        event.name,
                        event.description ? "\n" + event.description : "\n" + "No description provided" + "\n"
                    ].join(" "));
                });
            }
        }
        if (_$messaging.external) {
            if (_$messaging.external.mqtt) {
                if (_$messaging.external.mqtt.events) {
                    if (!_$messaging.external.mqtt.events.length) {
                        logger.info.error("No mqtt events defined");
                        return;
                    }
                    _$messaging.external.mqtt.events.forEach(function(event) {
                        return logger.info([
                            event.name,
                            event.description ? "\n" + event.description : "\n" + "No description provided" + "\n"
                        ].join(" "));
                    });
                }
            }
            if (_$messaging.external.socket) {
                if (_$messaging.external.socket.events) {
                    if (!_$messaging.external.socket.events.length) {
                        logger.info.error("No socket events defined");
                        return;
                    }
                    _$messaging.external.socket.events.forEach(function(event) {
                        return logger.info([
                            event.name,
                            event.description ? "\n" + event.description : "\n" + "No description provided" + "\n"
                        ].join(" "));
                    });
                }
            }
        }
    }
}
function params(params) {
    if (!params) return "";
    var log = "";
    if (params.required && params.required.length) log += "\n" + "required : ";
    if (params.required && params.required.length) params.required.forEach(function(param) {
        return log += param + " ";
    });
    if (params.optional && params.optional.length) log += "\n" + "optional : ";
    if (params.optional && params.optional.length) params.optional.forEach(function(param) {
        return log += param + " ";
    });
    return log;
}
function request(microservice, route) {
    return __awaiter(this, void 0, void 0, function() {
        var logger, http, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    logger = microservice.get("logger");
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    http = microservice.get("http");
                    return [
                        4,
                        http(microservice, route)
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
                case 3:
                    e = _state.sent();
                    logger.error(e.toString());
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
}
function redisSession(service) {
    var config = service.get("config");
    var logger = service.get("logger");
    var redisClient;
    if (!config.session) return;
    var app = service.get("app");
    var session = require("express-session");
    var RedisStore = require("connect-redis")(session);
    var createClient = require("redis").createClient;
    if (process.env.NODE_ENV === "development") {
        redisClient = createClient({
            legacyMode: true,
            socket: {
                host: process.env.REDIS_HOST || "redis",
                port: process.env.REDIS_PORT || 6379
            }
        });
    } else {
        redisClient = createClient({
            host: process.env.REDIS_HOST || "localhost",
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || "",
            legacyMode: true
        });
    }
    redisClient.connect().then(function() {
        return logger.info("[SERVER] Redis connected");
    }).catch(console.error);
    var sess = {
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({
            client: redisClient,
            logErrors: true,
            ttl: 10
        }),
        cookie: {
            maxAge: 10000
        }
    };
    if (app.get("env") === "production") {
        app.set("trust proxy", 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
}
function rateLimit(service) {
    var duration = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 15 * 60 * 1000, limit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10000;
    var app = service.get("app");
    var limiter = rateLimiter({
        windowMs: duration,
        max: limit,
        standardHeaders: true,
        message: "TooManyRequests"
    });
    app.use(limiter);
}
function messaging(service) {
    return __awaiter(this, void 0, void 0, function() {
        var logger, handler, server, config, clients, connection, channel, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err, client, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _loop1, _iterator1, _step1, io, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    logger = service.get("logger");
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        13,
                        ,
                        14
                    ]);
                    handler = service.get("handler");
                    server = service.get("server");
                    config = service.get("config");
                    clients = service.get("clients");
                    return [
                        4,
                        amqp.connect({
                            protocol: "amqp",
                            hostname: process.env.RABBITMQ_HOST || "localhost",
                            port: process.env.RABBITMQ_PORT || 5672,
                            username: process.env.RABBITMQ_USER || "guest",
                            password: process.env.RABBITMQ_PASSWORD || "<PASSWORD>",
                            vhost: process.env.RABBITMQ_VHOST || "/",
                            heartbeat: 10,
                            connectionTimeout: 10000,
                            socketTimeout: 10000
                        })
                    ];
                case 2:
                    connection = _state.sent();
                    logger.info("Amqp connected");
                    return [
                        4,
                        connection.createChannel()
                    ];
                case 3:
                    channel = _state.sent();
                    service.set("channel", channel);
                    if (!config.messaging) return [
                        3,
                        12
                    ];
                    if (!config.messaging.internal) return [
                        3,
                        11
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        9,
                        10,
                        11
                    ]);
                    _loop = function() {
                        var queue;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    queue = _step.value;
                                    return [
                                        4,
                                        channel.assertQueue(queue.name)
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        4,
                                        channel.consume(queue.name, function(message) {
                                            var content = message.content.toString();
                                            logger.info("[".concat(config.name, "] Getting Event [").concat(queue.name, "] <- From event source"));
                                            if (!handler[queue.name]) {
                                                logger.error("[".concat(config.name, "] Getting Event [").concat(queue.name, "] <- From event source"));
                                            }
                                            if (handler[queue.name]) {
                                                handler[queue.name]({
                                                    logger: logger,
                                                    waitForMessage: function(topic, cb) {
                                                        return waitForMessage(service, topic, cb);
                                                    },
                                                    publishInternalMessage: function(topic, message) {
                                                        return publishInternalMessage(service, topic, message);
                                                    },
                                                    publishExternalMessage: function(topic, message) {
                                                        return publishExternalMessage(service, topic, message);
                                                    }
                                                }, content);
                                            }
                                        }, {
                                            noAck: true
                                        })
                                    ];
                                case 2:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = config.messaging.internal.events[Symbol.iterator]();
                    _state.label = 5;
                case 5:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        8
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 6:
                    _state.sent();
                    _state.label = 7;
                case 7:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        5
                    ];
                case 8:
                    return [
                        3,
                        11
                    ];
                case 9:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        11
                    ];
                case 10:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 11:
                    // setup websockets
                    if (config.messaging.external) {
                        if (config.messaging.external.mqtt) {
                            // setup Mqtt
                            client = require("mqtt").connect(process.env.MQTT_URL, {
                                hostname: process.env.MQTT_HOST || "localhost",
                                clean: true,
                                connectTimeout: 4000,
                                reconnectPeriod: 1000
                            });
                            // PubSub to be used in the app
                            if ((config.messaging.external.mqtt.events && config.messaging.external.mqtt.events.length) > 0) {
                                logger.info("".concat(config.messaging.external.mqtt.events.length, " mqtt events to register"));
                                _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                try {
                                    _loop1 = function() {
                                        var event = _step1.value;
                                        logger.info("Registering event ".concat(event.name));
                                        client.on(event.name, function(topic, message) {
                                            return handler[event.name]({
                                                server: client,
                                                publishExternalMessage: function(topic, message) {
                                                    return publishExternalMessage(service, topic, message);
                                                }
                                            }, topic, message);
                                        });
                                    };
                                    for(_iterator1 = config.messaging.external.mqtt.events[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true)_loop1();
                                } catch (err) {
                                    _didIteratorError1 = true;
                                    _iteratorError1 = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                            _iterator1.return();
                                        }
                                    } finally{
                                        if (_didIteratorError1) {
                                            throw _iteratorError1;
                                        }
                                    }
                                }
                            }
                            service.set("mqtt", client);
                        }
                        if (config.messaging.external.socket) {
                            io = require("socket.io")(server, {
                                transports: [
                                    "websocket"
                                ],
                                cookie: true,
                                secure: true,
                                cors: {
                                    origin: "*",
                                    methods: [
                                        "GET",
                                        "POST"
                                    ]
                                }
                            });
                            io.on("connection", function(client) {
                                logger.info("[SERVER] New connection");
                                var query = client.handshake.query;
                                var clientType = query.clientType, name = query.client;
                                if (clientType) {
                                    if (query && (clientType === "service" || clientType === "application" || clientType === "service-" || clientType === "application-")) {
                                        // add client to connections
                                        clients.set(name, client);
                                        var connected = clients.get(name);
                                        if (connected) {
                                            logger.info("Client ".concat(name, " not connected, update client reference (connection update)"));
                                            logger.info([
                                                "Connected clients",
                                                clients.size,
                                                clients.keys()
                                            ].join(" "));
                                            connected.leave("event-room");
                                        }
                                        // update client
                                        connected.join("event-room");
                                        if ((config.messaging.external.socket.events && config.messaging.external.socket.events.length) > 0) {
                                            logger.info("".concat(config.messaging.external.socket.events.length, " socket events to register"));
                                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                            try {
                                                var _loop = function() {
                                                    var event = _step.value;
                                                    logger.info("Registering event ".concat(event.name));
                                                    connected.on(event.name, function(data) {
                                                        return handler[event.name]({
                                                            server: io,
                                                            socket: client,
                                                            publishExternalMessage: function(topic, message) {
                                                                return publishExternalMessage(service, topic, message);
                                                            }
                                                        }, data);
                                                    });
                                                };
                                                for(var _iterator = config.messaging.external.socket.events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
                                            } catch (err) {
                                                _didIteratorError = true;
                                                _iteratorError = err;
                                            } finally{
                                                try {
                                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                        _iterator.return();
                                                    }
                                                } finally{
                                                    if (_didIteratorError) {
                                                        throw _iteratorError;
                                                    }
                                                }
                                            }
                                        }
                                        connected.on("disconnect", function(reason) {
                                            // remove client to connections
                                            if (name) {
                                                connected.leave("event-room");
                                                logger.info([
                                                    "Disconnected",
                                                    name,
                                                    "reason",
                                                    reason
                                                ].join(" "));
                                                clients.delete(name);
                                                service.set("clients", clients.keys());
                                                logger.info([
                                                    "Connected clients",
                                                    clients.size
                                                ].join(" "));
                                            }
                                        });
                                    }
                                }
                            });
                            service.set("socket", io);
                        }
                    }
                    _state.label = 12;
                case 12:
                    return [
                        3,
                        14
                    ];
                case 13:
                    e = _state.sent();
                    logger.error(e);
                    return [
                        3,
                        14
                    ];
                case 14:
                    return [
                        2
                    ];
            }
        });
    });
}
function publishMQTTtMessage(service) {
    var topic = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "event", message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return __awaiter(this, void 0, void 0, function() {
        var mqtt, config, payload;
        return _ts_generator(this, function(_state) {
            mqtt = service.get("mqtt");
            config = service.get("config");
            if (!mqtt) return [
                2
            ];
            payload = Object.assign(Object.assign({}, message), {
                source: config.name,
                sentAt: new Date().toISOString()
            });
            mqtt.publish(topic, JSON.stringify(payload));
            return [
                2
            ];
        });
    });
}
function publishSocketMessage(service) {
    var topic = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "event", message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return __awaiter(this, void 0, void 0, function() {
        var socket, config, payload, _topic_split, type, room, event;
        return _ts_generator(this, function(_state) {
            socket = service.get("socket");
            config = service.get("config");
            if (!socket) return [
                2
            ];
            if (!topic) throw new Error("No topic provided");
            payload = Object.assign(Object.assign({}, message), {
                source: config.name,
                sentAt: new Date().toISOString()
            });
            if (topic.includes(":")) {
                _topic_split = _sliced_to_array(topic.split(":"), 3), type = _topic_split[0], room = _topic_split[1], event = _topic_split[2];
                if (type === "room") {
                    socket.sockets.in(room).emit(event, payload);
                } else {
                    socket.emit(event, payload);
                }
            } else {
                socket.emit(topic, payload);
            }
            return [
                2
            ];
        });
    });
}
function publishExternalMessage(service) {
    var topic = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "socket://event:event", message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return __awaiter(this, void 0, void 0, function() {
        var _topic_split, serviceType, target;
        return _ts_generator(this, function(_state) {
            _topic_split = _sliced_to_array(topic.split("://"), 2), serviceType = _topic_split[0], target = _topic_split[1];
            try {
                if (!serviceType) return [
                    2
                ];
                if (serviceType === "mqtt") return [
                    2,
                    publishMQTTtMessage(service, target, message)
                ];
                if (serviceType === "socket") return [
                    2,
                    publishSocketMessage(service, target, message)
                ];
            } catch (e) {
                console.log(e);
            }
            return [
                2
            ];
        });
    });
}
function waitForMessage(service, topic, cb) {
    var channel = service.get("channel");
    var logger = service.get("logger");
    channel.assertQueue(topic);
    if (!topic) {
        logger.error("No topic provided");
        return;
    }
    try {
        channel.consume(topic, function(message) {
            logger.info("[SERVER] Getting message from topic ".concat(topic));
            cb(message.content.toString());
        }, {
            noAck: true
        });
    } catch (e) {
        console.log(e);
    }
}
function publishInternalMessage(service) {
    var topic = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "event", message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return __awaiter(this, void 0, void 0, function() {
        var channel, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    channel = service.get("channel");
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        channel.assertQueue(topic)
                    ];
                case 2:
                    _state.sent();
                    channel.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
                    return [
                        3,
                        4
                    ];
                case 3:
                    e = _state.sent();
                    console.log(e);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
}
function routes(service) {
    var config = service.get("config");
    var logger = service.get("logger");
    if (config.routes) config.routes.forEach(function(route) {
        return request(service, route);
    });
    else logger.error("no appRoutes");
}
module.exports = {
    rateLimit: rateLimit,
    redisSession: redisSession,
    tree: tree,
    currentRoute: currentRoute,
    resources: resources,
    port: port,
    setupActions: setupActions,
    runActionsOnStartup: runActionsOnStartup,
    waitForMessage: waitForMessage,
    publishInternalMessage: publishInternalMessage,
    publishExternalMessage: publishExternalMessage,
    listActions: listActions,
    startAction: startAction,
    stopAction: stopAction,
    messaging: messaging,
    routes: routes
};
