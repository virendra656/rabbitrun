"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../../dao/_index");
function list(req, res) {
    return _index_1.LanguagesDao
        .findAll()
        .then(languages => res.status(200).send(languages))
        .catch(error => res.boom.badRequest(error));
}
exports.list = list;

//# sourceMappingURL=languages.get.js.map
