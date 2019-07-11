"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { User, CustomerProfile, Category } = require('../sqlz/models/_index');
const CryptoJS = require("crypto-js");
function findCustomerByEmailOrPhone(user) {
    return User.findOne({
        limit: 1,
        where: {
            $or: [
                {
                    email: {
                        $eq: user.email.toLowerCase()
                    }
                },
                {
                    mobile: {
                        $eq: user.mobile.replace(/ +?/g, '')
                    }
                }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
}
exports.findCustomerByEmailOrPhone = findCustomerByEmailOrPhone;
function login(user) {
    return User.findOne({
        limit: 1,
        where: {
            password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString(),
            $or: [
                {
                    email: {
                        $eq: user.email_or_mobile.toLowerCase()
                    }
                },
                {
                    mobile: {
                        $eq: user.email_or_mobile.replace(/ +?/g, '')
                    }
                }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
}
exports.login = login;
function getBusinessCategories() {
    return Category.findAll({
        limit: 1,
        where: { isActive: 1 },
        order: [['createdAt', 'DESC']]
    });
}
exports.getBusinessCategories = getBusinessCategories;
function findUserByOTP(user) {
    let obj = user.verifyOTP ? { verifyOTP: user.verifyOTP } : { forgotPasswordOTP: user.forgotPasswordOTP };
    return User.findOne({
        limit: 1,
        where: obj,
        order: [['createdAt', 'DESC']]
    });
}
exports.findUserByOTP = findUserByOTP;
function getCustomerById(userId) {
    return User.findOne({
        limit: 1,
        where: {
            userId,
        },
        attributes: ['name', 'latitude', 'longitude', 'businessType'],
        order: [['createdAt', 'DESC']]
    });
}
exports.getCustomerById = getCustomerById;
function register(user) {
    return User
        .create({
        email: user.email.toLowerCase(),
        verifyOTP: user.verifyOTP,
        mobile: user.mobile.replace(/ +?/g, ''),
        password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString()
    });
}
exports.register = register;
function updateDevice(user) {
    return User.update({ deviceType: user.deviceType, deviceToken: user.deviceToken }, { where: { id: user.id } });
}
exports.updateDevice = updateDevice;
function updateOTP(user) {
    return User.update({ forgotPasswordOTP: user.forgotPasswordOTP }, { where: { id: user.id } });
}
exports.updateOTP = updateOTP;
function verifyAccount(user) {
    return User.update({ isVerified: 1 }, { where: { id: user.id } });
}
exports.verifyAccount = verifyAccount;
function changePassword(user) {
    return User.update({ password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString(), isVerified: 1 }, { where: { forgotPasswordOTP: user.forgotPasswordOTP } });
}
exports.changePassword = changePassword;
function setCustomerProfile(customer, user) {
    return CustomerProfile.create({
        name: customer.name,
        userId: user.id,
        address: customer.address,
        latitude: customer.latitude,
        longitude: customer.longitude,
        businessType: customer.businessType,
        accountNumber: customer.accountNumber,
        ifsc: customer.ifsc,
        bank_name: customer.bank_name,
        phone_number: customer.phone_number,
        gst: customer.gst,
        firm_name: customer.firm_name,
    });
}
exports.setCustomerProfile = setCustomerProfile;

//# sourceMappingURL=users.js.map
