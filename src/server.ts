import * as express from 'express'
import * as winston from 'winston'
import * as boom from 'express-boom'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as _ from 'lodash'
import * as expressValidator from 'express-validator'
import { json, urlencoded } from 'body-parser'
import { Express } from 'express'
import * as routes from './routes/_index'
import * as dotenv from 'dotenv';
import { renderResponse, to } from './util/helper';
import { UserDao } from './dao/_index'

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
      console.log('Client connected...', client.id);

      client.on('join', function (data) {
        //console.log(io.sockets.sockets);
        if (data && data.userId) {
          data.socketId = client.id;
          UserDao.saveSocketConnection(data);
        }

      });


      client.on('searchDriver', async function (data) {

        if (data && data.latitude && data.longitude) {
          let [err, res] = await to(UserDao.nearByDrivers(data));
          if (res && res.length) {
            let items = [];
            res.forEach(element => {

              //     console.log("8888888888888888");
              //   console.log(element.socketId);

              // console.log(Object.keys(io.sockets.sockets));
              //  console.log(element)

              items.push(element);
              if (io.sockets.sockets[element.socketId]) {
                _.extend(element, data);
                io.sockets.sockets[element.socketId].emit('bookingRequest', element);
              }
            });
            console.log(Object.keys(io.sockets.sockets));
            //console.log(items);

          }
        }

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
