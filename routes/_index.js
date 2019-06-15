"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const LanguagesRoutes = require("./languages");
const AppUserRoutes = require("./appusers");
const CustomerRoutes = require("./customers");
function initRoutes(app) {
    winston.log('info', '--> Initialisations des routes');
    app.get('/api', (req, res) => res.status(200).send({
        message: 'server is running!'
    }));
    LanguagesRoutes.routes(app);
    AppUserRoutes.routes(app);
    CustomerRoutes.routes(app);
    app.all('*', (req, res) => res.boom.notFound());
}
exports.initRoutes = initRoutes;

//# sourceMappingURL=_index.js.map
