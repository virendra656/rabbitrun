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
        server.listen(process.env.PORT || PORT, () => {
            winston.log('info', '--> Server successfully started at port %d', PORT);
        });
        io.on('connection', function (client) {
            console.log('Client connected...', client.id);
            client.on('join', function (data) {
                try {
                    data = JSON.parse(data);
                }
                catch (e) {
                    console.log(e);
                }
                console.log('Client joining...', data);
                console.log('Client id...', client.id);
                console.log('data id...', data.userId);
                if (data && data.userId) {
                    data.socketId = client.id;
                    _index_1.UserDao.saveSocketConnection(data);
                }
            });
            client.on('searchDriver', function (reading) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("searchDriver");
                    let str = reading.toString('utf8');
                    console.log("String = %s", str);
                    let data = JSON.parse(str);
                    console.log("searchDriver", data);
                    try {
                    }
                    catch (e) {
                    }
                    console.log(data);
                    let source = data && data.source ? data.source : null;
                    if (source && source.latitude && source.longitude) {
                        let [err, res] = yield helper_1.to(_index_1.UserDao.nearByDrivers(source));
                        console.log("drivers");
                        console.log(res);
                        if (res && res.length) {
                            let items = [];
                            res.forEach(element => {
                                items.push(element);
                                if (io.sockets.sockets[element.socketId]) {
                                    io.sockets.sockets[element.socketId].emit('bookingRequest', data);
                                }
                            });
                            console.log(Object.keys(io.sockets.sockets));
                        }
                    }
                });
            });
            client.on('updateBookingStatus', function (data) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    console.log("updateBookingStatus", data);
                    let err;
                    let dbbooking;
                    let customer;
                    let booking = data && data.booking && data.booking.status ? data.booking : null;
                    let driver = data && data.driver && data.driver.userId ? data.driver : null;
                    let user = data && data.user && data.user.userId ? data.user : null;
                    if (booking && driver && user) {
                        [err, dbbooking] = yield helper_1.to(_index_1.UserDao.updateBookingStatus(booking, driver, user));
                        console.log("dbbooking");
                        console.log(dbbooking);
                        [err, customer] = yield helper_1.to(_index_1.UserDao.findUserSocketConnection(user));
                        console.log("customer");
                        console.log(customer);
                        if (customer && customer.socketId) {
                            if (io.sockets.sockets[customer.socketId]) {
                                data.booking = { id: dbbooking.dataValues.id, userId: dbbooking.dataValues.userId, driverId: dbbooking.dataValues.driverId, status: dbbooking.dataValues.status };
                                io.sockets.sockets[customer.socketId].emit('bookingStatusChanged', data);
                                client.emit('bookingStatusChanged', data);
                            }
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
