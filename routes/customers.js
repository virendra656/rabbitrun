"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../endpoints/_index");
const SiteConfig_1 = require("../util/SiteConfig");
const helper_1 = require("../util/helper");
function routes(app) {
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/register', _index_1.CustomerController.CustomerPost.register);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/login', _index_1.CustomerController.CustomerPost.login);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/verifyAccount', _index_1.CustomerController.CustomerPost.verifyAccount);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/forgotPassword', _index_1.CustomerController.CustomerPost.forgotPassword);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/changePassword', _index_1.CustomerController.CustomerPost.changePassword);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/getBusinessCategories', _index_1.CustomerController.CustomerPost.getBusinessCategories);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/getBookings', [helper_1.AuthGuard], _index_1.CustomerController.CustomerPost.getBookings);
    app.post(SiteConfig_1.CONSTANTS.apiBasePath + 'customer/getProfile', [helper_1.AuthGuard], _index_1.CustomerController.CustomerPost.getProfile);
}
exports.routes = routes;

//# sourceMappingURL=customers.js.map
