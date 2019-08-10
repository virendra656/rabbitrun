import * as express from 'express'
import * as winston from 'winston'
import * as boom from 'express-boom'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as expressValidator from 'express-validator'
import { json, urlencoded } from 'body-parser'
import { Express } from 'express'
import * as routes from './routes/_index'
import * as dotenv from 'dotenv';
import { renderResponse } from './util/helper';
const PORT: number = 3000

/**
 * Root class of your node server.
 * Can be used for basic configurations, for instance starting up the server or registering middleware.
 */
export class Server {

  private app: Express

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
    }))
    this.app.use(urlencoded({
      extended: true
    }))
    this.app.use(json())

    this.app.use(boom());
    this.app.use(morgan('combined'));
    this.app.use(expressValidator());

    routes.initRoutes(this.app);
    this.app.use(function (err, req, res, next) {
      console.error("err.stack");
      renderResponse(res, null, err, null);
    });
    //this.initSocket(io);
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
        //		client.broadcast.emit('broad',data);
        //client.broadcast.emit('broad',data);
      });

    })
  }
  initSocket(io) {


  }
  getApp() {
    return this.app
  }
}
new Server()
