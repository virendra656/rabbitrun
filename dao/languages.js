"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const _index_1 = require("../sqlz/models/_index");
function create(language) {
    return _index_1.default.Language
        .create({
        id: uuid.v1(),
        label: language.label,
        name: language.name
    });
}
exports.create = create;
function findAll() {
    return _index_1.default.Language
        .findAll();
}
exports.findAll = findAll;

//# sourceMappingURL=languages.js.map
