"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../../dao/_index");
function create(req, res) {
    return _index_1.LanguagesDao.create(req.body)
        .then(language => res.status(201).send(language))
        .catch(error => res.boom.badRequest(error));
}
exports.create = create;

//# sourceMappingURL=languages.post.js.map
