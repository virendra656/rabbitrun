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
        console.log("searchDriver");
        console.log(data);
        let source = data && data.source ? data.source : null;
        if (source && source.latitude && source.longitude) {
          let [err, res] = await to(UserDao.nearByDrivers(source));
          console.log("drivers");
          console.log(res);
          
          if (res && res.length) {
            let items = [];
            res.forEach(element => {
              items.push(element);
              if (io.sockets.sockets[element.socketId]) {
                //_.extend(element, data);
                io.sockets.sockets[element.socketId].emit('bookingRequest', data);
              }
            });
            console.log(Object.keys(io.sockets.sockets));
            //console.log(items);

          }
        }

      });

      client.on('updateBookingStatus', async function (data) {
        console.log("updateBookingStatus", data);
        let err: any;
        let dbbooking: any;
        let customer: any;
        let booking = data && data.booking && data.booking.status ? data.booking : null;
        let driver = data && data.driver && data.driver.userId ? data.driver : null;
        let user = data && data.user && data.user.userId ? data.user : null;
        if (booking && driver && user) {
          [err, dbbooking] = await to(UserDao.updateBookingStatus(booking, driver, user));
          console.log("dbbooking");
          console.log(dbbooking);
          [err, customer] = await to(UserDao.findUserSocketConnection(user));

          console.log("customer");
          console.log(customer);

          if (customer && customer.socketId) {
            if (io.sockets.sockets[customer.socketId]) {
              //_.extend(element, data);
              data.booking = {id : dbbooking.dataValues.id, userId: dbbooking.dataValues.userId, driverId:  dbbooking.dataValues.driverId, status: dbbooking.dataValues.status};
              io.sockets.sockets[customer.socketId].emit('bookingStatusChanged', data);
              client.emit('bookingStatusChanged', data);
            }
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
