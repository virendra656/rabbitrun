"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../endpoints/_index");
function routes(app) {
    app.get('/api/languages', _index_1.LanguageController.LanguageGet.list);
    app.post('/api/languages', _index_1.LanguageController.LanguagePost.create);
}
exports.routes = routes;

//# sourceMappingURL=languages.js.map
