"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _index_1 = require("../../dao/_index");
function create(req, res) {
    req.checkBody('pwd', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'A valid email is required').isEmail();
    req.getValidationResult()
        .then(function (result) {
        if (result.isEmpty()) {
            return _index_1.AppUserDao.create(req.body)
                .then(appuser => res.status(201).send(appuser))
                .catch(error => res.boom.badRequest(error));
        }
        else {
            res.boom.badRequest('Validation errors', result.mapped());
        }
    });
}
exports.create = create;
function login(req, res) {
    req.checkBody('pwd', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'A valid email is required').isEmail();
    req.getValidationResult()
        .then(function (result) {
        if (result.isEmpty()) {
            return _index_1.AppUserDao.login(req.body);
        }
        else {
            res.boom.badRequest('Validation errors', result.mapped());
        }
    })
        .then(appuser => res.status(200).send(appuser))
        .catch(error => res.boom.badRequest(error));
}
exports.login = login;

//# sourceMappingURL=appusers.post.js.map
