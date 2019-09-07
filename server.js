"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const winston = require("winston");
const boom = require("express-boom");
const morgan = require("morgan");
const cors = require("cors");
const _ = require("lodash");
const expressValidator = require("express-validator");
const body_parser_1 = require("body-parser");
const routes = require("./routes/_index");
const dotenv = require("dotenv");
const helper_1 = require("./util/helper");
const _index_1 = require("./dao/_index");
const PORT = 3000;
class Server {
    constructor() {
        dotenv.config();
        this.app = express();
        var server = require('http').createServer(this.app);
        var io = require('socket.io')(server);
        this.app.use(function (err, req, res, next) {
            console.error("err.stack");
        });
        this.app.use(cors({
            optionsSuccessStatus: 200
        }));
        this.app.use(body_parser_1.urlencoded({
            extended: true
        }));
        this.app.use(body_parser_1.json());
        this.app.use(boom());
        this.app.use(morgan('combined'));
        this.app.use(expressValidator());
        routes.initRoutes(this.app);
        this.app.use(function (err, req, res, next) {
            console.error("err.stack");
            helper_1.renderResponse(res, null, err, null);
        });
        server.listen(PORT, () => {
            winston.log('info', '--> Server successfully started at port %d', PORT);
        });
        io.on('connection', function (client) {
            console.log('Client connected...', client.id);
            client.on('join', function (data) {
                if (data && data.userId) {
                    data.socketId = client.id;
                    _index_1.UserDao.saveSocketConnection(data);
                }
            });
            client.on('searchDriver', function (data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (data && data.latitude && data.longitude) {
                        let [err, res] = yield helper_1.to(_index_1.UserDao.nearByDrivers(data));
                        if (res && res.length) {
                            let items = [];
                            res.forEach(element => {
                                items.push(element);
                                if (io.sockets.sockets[element.socketId]) {
                                    _.extend(element, data);
                                    io.sockets.sockets[element.socketId].emit('bookingRequest', element);
                                }
                            });
                            console.log(Object.keys(io.sockets.sockets));
                        }
                    }
                });
            });
            client.on('messages', function (data) {
                client.emit('broad', data);
            });
        });
    }
    initSocket(io) {
    }
    getApp() {
        return this.app;
    }
}
exports.Server = Server;
new Server();

//# sourceMappingURL=server.js.map
