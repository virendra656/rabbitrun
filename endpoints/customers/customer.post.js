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
            let err, result, user, customerProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.CREATED,
                data: {},
                message: "Registrated successfully !! We have sent you an otp please verify your mobile number"
            };
            [err, result] = yield helper_1.to(Validators_1.validateCustomerRegisteration(req));
            helper_1.renderResponse(res, result, null, null);
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
            [err, user] = yield helper_1.to(_index_1.UserDao.register(req.body));
            if (err)
                throw err;
            [err, customerProfile] = yield helper_1.to(_index_1.UserDao.setCustomerProfile(req.body, user));
            if (err)
                throw err;
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
            user.message = user.verifyOTP + " is your one time password  to verify your account";
            user.subject = " Rabbitrun Registration";
            user.html = `<p>Hello ${user.name},</p>

        <p>${user.verifyOTP} is your one time password for to verify your account account.</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
            helper_1.OTPSend(user);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, customerProfile, device;
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
            [err, customerProfile] = yield helper_1.to(_index_1.UserDao.getCustomerById(user.id));
            _.extend(user, customerProfile);
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
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("req", req.body);
            let err, result, user, customerProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "otp sent successfully on "
            };
            if (!req.body.email_or_mobile) {
                throw new Error("Please enter valid email or mobile number");
            }
            req.body.email = req.body.email_or_mobile;
            req.body.mobile = req.body.email_or_mobile;
            [err, user] = yield helper_1.to(_index_1.UserDao.findCustomerByEmailOrPhone(req.body));
            if (err)
                throw err;
            if (!user) {
                if (req.body.email_or_mobile.indexOf("@") > -1)
                    throw new Error("Incorrect email address");
                else
                    throw new Error("Incorrect mobile number");
            }
            user.forgotPasswordOTP = helper_1.generateUniqueId(null, 6);
            [err, customerProfile] = yield helper_1.to(_index_1.UserDao.updateOTP(user));
            if (err)
                throw err;
            user.message = user.forgotPasswordOTP + " is your one time password  to change your password";
            user.subject = " Forgot Password on Rabbitrun";
            user.html = `<p>Hello User,</p>

        <p>${user.forgotPasswordOTP} is your one time password  to reset your password</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
            if (req.body.email_or_mobile.indexOf("@") > -1) {
                helper_1.EmailSend(user);
                finalResponse.message += "registered email address";
            }
            else {
                helper_1.OTPSend(user);
                finalResponse.message += "registered mobile number";
            }
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.forgotPassword = forgotPassword;
function verifyAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, customerProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "Account verified successfully"
            };
            if (!req.body.verifyOTP) {
                throw new Error("otp is missing");
            }
            [err, user] = yield helper_1.to(_index_1.UserDao.findUserByOTP(req.body));
            if (err)
                throw err;
            if (!user) {
                throw new Error("Incorrect OTP");
            }
            if (user.isVerified == 1)
                throw new Error("Your account is already verified");
            [err, customerProfile] = yield helper_1.to(_index_1.UserDao.verifyAccount(user));
            if (err)
                throw err;
            user.isVerified = 1;
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.verifyAccount = verifyAccount;
function getBusinessCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, categories, customerProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "Categories found"
            };
            [err, categories] = yield helper_1.to(_index_1.UserDao.getBusinessCategories());
            if (err)
                throw err;
            finalResponse.data.categories = categories;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.getBusinessCategories = getBusinessCategories;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let err, result, user, customerProfile;
            let finalResponse = {
                code: SiteConfig_1.Codes.OK,
                data: {},
                message: "Password reset successfully"
            };
            [err, result] = yield helper_1.to(Validators_1.validateCustomerChangePassword(req));
            helper_1.renderResponse(res, result, null, null);
            [err, user] = yield helper_1.to(_index_1.UserDao.findUserByOTP(req.body));
            if (err)
                throw err;
            if (!user) {
                throw new Error("Incorrect OTP");
            }
            if (user.isVerified == 0)
                throw new Error("Your account is not verified yet");
            [err, customerProfile] = yield helper_1.to(_index_1.UserDao.changePassword(req.body));
            if (err)
                throw err;
            finalResponse.data.user = user;
            helper_1.renderResponse(res, null, null, finalResponse);
        }
        catch (e) {
            helper_1.renderResponse(res, null, e, null);
        }
    });
}
exports.changePassword = changePassword;

//# sourceMappingURL=customer.post.js.map
