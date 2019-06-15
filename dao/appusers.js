"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const _index_1 = require("../sqlz/models/_index");
function create(appUser) {
    return _index_1.default.Language.findOne({
        where: { name: 'fr' }
    })
        .then(language => {
        return _index_1.default.AppUser
            .create({
            id: uuid.v1(),
            email: appUser.email,
            pwd: appUser.pwd,
            languageId: language.get('id')
        });
    });
}
exports.create = create;
function findAll() {
    return _index_1.default.AppUser
        .findAll({ include: [{ all: true }] });
}
exports.findAll = findAll;
function login(appUser) {
    return _index_1.default.AppUser
        .findOne({
        where: {
            email: appUser.email,
            pwd: appUser.pwd
        },
        include: [_index_1.default.Language]
    });
}
exports.login = login;

//# sourceMappingURL=appusers.js.map
