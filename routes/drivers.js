"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../endpoints/_index");
const SiteConfig_1 = require("../util/SiteConfig");
const jwt = require("jsonwebtoken");
function Auth(req, res, next) {
    try {
        var decoded = jwt.verify(req.headers.authorization, process.env.EncryptionKEY);
        req.body.user = decoded.data;
        return next();
    }
    catch (e) {
        return next(e);
    }
}
function routes(app) {
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/register', _index_1.DriverController.DriverPost.register);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/login', _index_1.DriverController.DriverPost.login);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/updateDriverLocation', [Auth], _index_1.DriverController.DriverPost.updateDriverLocation);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/nearByDrivers', [Auth], _index_1.DriverController.DriverPost.nearByDrivers);
}
exports.routes = routes;

//# sourceMappingURL=drivers.js.map
