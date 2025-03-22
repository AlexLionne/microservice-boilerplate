"use strict";
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var _require = require("../functions"), startAction = _require.startAction, stopAction = _require.stopAction, listActions = _require.listActions, publishInternalMessage = _require.publishInternalMessage, publishExternalMessage = _require.publishExternalMessage, waitForMessage = _require.waitForMessage;
module.exports = function http(service, route) {
    var microservice = service.get("app");
    var handler = service.get("handler");
    var logger = service.get("logger");
    var endpoint = route.endpoint, method = route.method, name = route.name, middlewares = route.middlewares;
    if (!endpoint || !endpoint.includes("/") || ![
        "get",
        "post",
        "put",
        "delete",
        "options",
        "option",
        "patch"
    ].includes(method.toLowerCase())) return logger.info("Check endpoint configuration nor method used in the configuration file");
    // handle middlewares
    var actions = [];
    if (middlewares && middlewares.length) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var _$middleware = _step.value;
                if (!handler[_$middleware]) throw "[".concat(_$middleware, "] - No handler for this middleware");
                actions.push(function(req, res, next) {
                    return handler[_$middleware](req, res, next);
                });
            };
            for(var _iterator = middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
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
    function middleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function() {
            var e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        if (!handler[name]) {
                            logger.error("No functions associated with this route");
                            logger.error("Handler could be null to");
                        }
                        return [
                            4,
                            handler[name](req, res, next)
                        ];
                    case 1:
                        _state.sent();
                        return [
                            3,
                            3
                        ];
                    case 2:
                        e = _state.sent();
                        logger.error(e);
                        return [
                            2,
                            res.status(500).send()
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
    }
    function loggerMiddleware(req, res, next) {
        var logger = service.get("logger");
        req.logger = logger;
        next();
    }
    function actionManager(req, res, next) {
        req.actionManager = {
            start: function(id) {
                return startAction(service, id);
            },
            stop: function(id) {
                return stopAction(service, id);
            },
            actions: function() {
                return listActions(service);
            }
        };
        next();
    }
    function socketServer(req, res, next) {
        req.socketServer = service.get("socket");
        next();
    }
    function messaging(req, res, next) {
        req.messaging = {
            waitForMessage: function(topic, cb) {
                return waitForMessage(service, topic, cb);
            },
            publishInternalMessage: function(topic, message) {
                return publishInternalMessage(service, topic, message);
            },
            publishExternalMessage: function(topic, message) {
                return publishExternalMessage(service, topic, message);
            }
        };
        next();
    }
    // send event
    try {
        if (method.toLowerCase() === "get") microservice.get(endpoint, loggerMiddleware, socketServer, actionManager, messaging, actions, middleware);
        if (method.toLowerCase() === "post") microservice.post(endpoint, loggerMiddleware, socketServer, actionManager, messaging, actions, middleware);
        if (method.toLowerCase() === "put") microservice.put(endpoint, loggerMiddleware, socketServer, actionManager, messaging, actions, middleware);
        if (method.toLowerCase() === "delete") microservice.delete(endpoint, loggerMiddleware, socketServer, actionManager, messaging, actions, middleware);
    } catch (e) {
        logger.error(e);
        return e.message;
    }
};
