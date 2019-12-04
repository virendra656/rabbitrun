"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../endpoints/_index");
const SiteConfig_1 = require("../util/SiteConfig");
const helper_1 = require("../util/helper");
function routes(app) {
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/register', _index_1.DriverController.DriverPost.register);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/login', _index_1.DriverController.DriverPost.login);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/updateDriverLocation', [helper_1.AuthGuard], _index_1.DriverController.DriverPost.updateDriverLocation);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'driver/nearByDrivers', [helper_1.AuthGuard], _index_1.DriverController.DriverPost.nearByDrivers);
}
exports.routes = routes;

//# sourceMappingURL=drivers.js.map
