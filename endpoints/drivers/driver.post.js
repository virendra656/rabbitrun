"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../util/helper");
const Validators_1 = require("../../util/Validators");
const _index_1 = require("../../dao/_index");
const SiteConfig_1 = require("../../util/SiteConfig");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, driverProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.CREATED,
                data: {},
                message: "Driver registrated successfully !!"
            };
            [err, result] = yield helper_1.to(Validators_1.validateDriverRegisteration(req));
            helper_1.renderResponse(res, result, null, null);
            req.body.role = 2;
            [err, user] = yield helper_1.to(_index_1.UserDao.findCustomerByEmailOrPhone(req.body));
            if (err)
                throw err;
            if (user) {
                if (req.body.mobile.replace(/ +?/g, '') == user.mobile)
                    throw new Error("User already exist with this mobile number");
                else if (req.body.email.toLowerCase() == user.email)
                    throw new Error("User already exist with this email address");
            }
            req.body.verifyOTP = helper_1.generateUniqueId(null, 6);
            req.body.isVerified = 1;
            [err, user] = yield helper_1.to(_index_1.UserDao.register(req.body));
            if (err)
                throw err;
            [err, driverProfile] = yield helper_1.to(_index_1.UserDao.setDriverProfile(req.body, user));
            if (err)
                throw err;
            _.extend(user, driverProfile);
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
            user.subject = " Rabbitrun Driver Registration";
            user.html = `<p>Hello ${user.name},</p>

        <p> your account  is created successfully . you email address is ${user.email} and password would be ${user.password} for login.</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
            helper_1.EmailSend(user);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.register = register;
function updateDriverLocation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, driverProfile, device;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "Location updated successfully !!"
            };
            [err, result] = yield helper_1.to(Validators_1.validateLocation(req));
            if (result && !result.isEmpty()) {
                helper_1.renderResponse(res, result, null, null);
            }
            req.body.id = req.body.user.id;
            [err, device] = yield helper_1.to(_index_1.UserDao.updateDriverLocation(req.body));
            if (err)
                throw err;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.updateDriverLocation = updateDriverLocation;
function nearByDrivers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, driverProfile, device;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {
                    drivers: []
                },
                message: "Drivers listed successfully !!"
            };
            [err, result] = yield helper_1.to(Validators_1.validateLocation(req));
            if (result && !result.isEmpty()) {
                helper_1.renderResponse(res, result, null, null);
            }
            req.body.id = req.body.user.id;
            [err, finalResponse.data.drivers] = yield helper_1.to(_index_1.UserDao.nearByDrivers(req.body));
            if (err)
                throw err;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.nearByDrivers = nearByDrivers;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, driverProfile, device;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "Logged in successfully !!"
            };
            if (!req.body.email_or_mobile && !req.body.password) {
                throw new Error("Insufficent credentials");
            }
            [err, user] = yield helper_1.to(_index_1.UserDao.login(req.body));
            if (err)
                throw err;
            if (!user) {
                if (req.body.email_or_mobile.indexOf("@") > -1)
                    throw new Error("Incorrect password or email");
                else
                    throw new Error("Incorrect password or mobile number");
            }
            req.body.id = user.id;
            if (req.body.deviceType && req.body.deviceToken) {
                [err, device] = yield helper_1.to(_index_1.UserDao.updateDevice(req.body));
                if (err)
                    throw err;
            }
            [err, driverProfile] = yield helper_1.to(_index_1.UserDao.getDriverById(user.id));
            console.log("driverProfile =========");
            console.log(driverProfile);
            _.extend(user, driverProfile);
            let token = jwt.sign({
                data: user
            }, process.env.EncryptionKEY, { expiresIn: '7d' });
            finalResponse.data.token = token;
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.login = login;

//# sourceMappingURL=driver.post.js.map
