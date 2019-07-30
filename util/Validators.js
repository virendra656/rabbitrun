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
function validateCustomerRegisteration(req) {
    return __awaiter(this, void 0, void 0, function* () {
        req.checkBody('name', 'Mobile is required').notEmpty();
        req.checkBody('address', 'Address is required').notEmpty();
        req.checkBody('latitude', 'Latitude is required').notEmpty();
        req.checkBody('longitude', 'Longitude is required').notEmpty();
        req.checkBody('businessType', 'Business type is required').notEmpty();
        req.checkBody('accountNumber', 'Account number is required').notEmpty();
        req.checkBody('ifsc', 'IFSC code is required').notEmpty();
        req.checkBody('bank_name', 'Bank name is required').notEmpty();
        req.checkBody('mobile', 'Mobile is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'A valid email is required').isEmail();
        return req.getValidationResult();
    });
}
exports.validateCustomerRegisteration = validateCustomerRegisteration;
function validateDriverRegisteration(req) {
    return __awaiter(this, void 0, void 0, function* () {
        req.checkBody('name', 'Mobile is required').notEmpty();
        req.checkBody('latitude', 'Latitude is required').notEmpty();
        req.checkBody('longitude', 'Longitude is required').notEmpty();
        req.checkBody('businessType', 'Business type is required').notEmpty();
        req.checkBody('mobile', 'Mobile is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'A valid email is required').isEmail();
        return req.getValidationResult();
    });
}
exports.validateDriverRegisteration = validateDriverRegisteration;
function validateCustomerChangePassword(req) {
    return __awaiter(this, void 0, void 0, function* () {
        req.checkBody('forgotPasswordOTP', 'OTP is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        return req.getValidationResult();
    });
}
exports.validateCustomerChangePassword = validateCustomerChangePassword;
function validateLocation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        req.checkBody('latitude', 'latitude is required').notEmpty();
        req.checkBody('longitude', 'longitude is required').notEmpty();
        return req.getValidationResult();
    });
}
exports.validateLocation = validateLocation;

//# sourceMappingURL=Validators.js.map
