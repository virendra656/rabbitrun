"use strict";
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
            console.log('Client connected...');
            client.on('join', function (data) {
                console.log(data);
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
