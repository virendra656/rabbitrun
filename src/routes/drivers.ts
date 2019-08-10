import { Express } from 'express'
import { DriverController } from '../endpoints/_index'
import { CONSTANTS } from '../util/SiteConfig';
import * as jwt from 'jsonwebtoken';

function Auth(req, res, next) {
  try {
    var decoded = jwt.verify(req.headers.authorization, process.env.EncryptionKEY);
    req.body.user = decoded.data;
    return next();
  } catch (e) {
    return next(e);
  }
}

export function routes(app: Express) {
  app.post(CONSTANTS.apiBasePath + 'driver/register', DriverController.DriverPost.register);
  app.post(CONSTANTS.apiBasePath + 'driver/login', DriverController.DriverPost.login);
  app.post(CONSTANTS.apiBasePath + 'driver/updateDriverLocation', [Auth], DriverController.DriverPost.updateDriverLocation);
  app.post(CONSTANTS.apiBasePath + 'driver/nearByDrivers', [Auth], DriverController.DriverPost.nearByDrivers);
}
