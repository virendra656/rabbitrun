"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const db = {};
function create(appUser) {
    return db.Language.findOne({
        where: { name: 'fr' }
    })
        .then(language => {
        return db.AppUser
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
    return db.AppUser
        .findAll({ include: [{ all: true }] });
}
exports.findAll = findAll;
function login(appUser) {
    return db.AppUser
        .findOne({
        where: {
            email: appUser.email,
            pwd: appUser.pwd
        },
        include: [db.Language]
    });
}
exports.login = login;

//# sourceMappingURL=appusers.js.map
