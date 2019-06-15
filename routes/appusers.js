"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../endpoints/_index");
function routes(app) {
    app.get('/api/appUsers', _index_1.AppUserController.AppUserGet.list);
    app.post('/api/appUsers', _index_1.AppUserController.AppUserPost.create);
    app.post('/api/appUsers/login', _index_1.AppUserController.AppUserPost.login);
}
exports.routes = routes;

//# sourceMappingURL=appusers.js.map
