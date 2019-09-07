"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { User, CustomerProfile, Category, DriverProfile, SocketConnections, sequelize } = require('../sqlz/models/_index');
const CryptoJS = require("crypto-js");
const sequelizeModule = require('sequelize');
function findCustomerByEmailOrPhone(user) {
    return User.findOne({
        raw: true,
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
        raw: true,
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
        raw: true,
        limit: 1,
        where: { isActive: 1 },
        order: [['createdAt', 'DESC']]
    });
}
exports.getBusinessCategories = getBusinessCategories;
function findUserByOTP(user) {
    let obj = user.verifyOTP ? { verifyOTP: user.verifyOTP } : { forgotPasswordOTP: user.forgotPasswordOTP };
    return User.findOne({
        raw: true,
        limit: 1,
        where: obj,
        order: [['createdAt', 'DESC']]
    });
}
exports.findUserByOTP = findUserByOTP;
function getDriverById(userId) {
    return DriverProfile.findOne({
        raw: true,
        limit: 1,
        where: {
            userId,
        },
        attributes: ['name', 'latitude', 'longitude', 'businessType'],
        order: [['createdAt', 'DESC']]
    });
}
exports.getDriverById = getDriverById;
function getCustomerById(userId) {
    return CustomerProfile.findOne({
        raw: true,
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
        isVerified: user.isVerified ? 1 : 0,
        role: user.role || 3,
        mobile: user.mobile.replace(/ +?/g, ''),
        password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString()
    });
}
exports.register = register;
function updateDevice(user) {
    return User.update({ deviceType: user.deviceType, deviceToken: user.deviceToken }, { where: { id: user.id } });
}
exports.updateDevice = updateDevice;
function nearByDrivers(user) {
    let lati = user.latitude;
    let longi = user.longitude;
    return sequelize.query(`
  SELECT
    dp.userId,
    
    (3959 * ACOS(COS(RADIANS(${lati})) * COS(RADIANS(dp.latitude)) * COS(RADIANS(dp.longitude) - RADIANS(${longi})) + SIN(RADIANS(${lati})) * SIN(RADIANS(dp.latitude)))) AS distance,
    dp.name,    
    sc.socketId    
  FROM driver_profiles  dp
  JOIN socket_connections sc
    ON sc.userId = dp.userId
  WHERE 1 = 1
  GROUP BY dp.userId
  HAVING distance <= 550000
  ORDER BY distance ASC;`, { type: sequelize.QueryTypes.SELECT });
}
exports.nearByDrivers = nearByDrivers;
function saveSocketConnection(user) {
    return SocketConnections.findOne({ where: { userId: user.userId } })
        .then(function (obj) {
        if (obj) {
            return obj.update(user);
        }
        else {
            return SocketConnections.create(user);
        }
    });
}
exports.saveSocketConnection = saveSocketConnection;
function updateDriverLocation(user) {
    return DriverProfile.update({ latitude: user.latitude, longitude: user.longitude }, { where: { id: user.id } });
}
exports.updateDriverLocation = updateDriverLocation;
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
function setDriverProfile(driver, user) {
    return DriverProfile.create({
        name: driver.name,
        userId: user.id,
        address: driver.address,
        latitude: driver.latitude,
        longitude: driver.longitude,
        businessType: driver.businessType
    });
}
exports.setDriverProfile = setDriverProfile;
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
