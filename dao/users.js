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
const { User, CustomerProfile, Category, DriverProfile, SocketConnections, sequelize, Booking } = require('../sqlz/models/_index');
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
function getBookings(params) {
    params.page = params.page || 1;
    params.limit = params.limit || 20;
    return Booking.find({
        raw: true,
        offset: ((params.page - 1) * params.limit),
        limit: params.limit,
        where: {
            status: 'COMPLETED',
            $or: [
                {
                    userId: {
                        $eq: params.user_id
                    }
                },
                {
                    driverId: {
                        $eq: params.user_id
                    }
                }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
}
exports.getBookings = getBookings;
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
function updateBookingStatus(booking, driver, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (booking.status == 'INITIATED' || booking.status == 'COMPLETED' || booking.status == 'REJECTED') {
            DriverProfile.update({
                bookingStatus: booking.status == 'INITIATED' ? 'BOOKED' : ''
            }, { where: { userId: driver.userId } });
        }
        return Booking.findOne({ where: { userId: user.userId, driverId: driver.userId, id: booking.id } })
            .then(function (obj) {
            if (obj) {
                return obj.update({ status: booking.status, latitude: booking.latitude, longitude: booking.longitude, source: booking.source, destination: booking.destination });
            }
            else {
                return Booking.create({ userId: user.userId, driverId: driver.userId, status: booking.status, latitude: booking.latitude, longitude: booking.longitude, source: booking.source, destination: booking.destination });
            }
        });
    });
}
exports.updateBookingStatus = updateBookingStatus;
function getProfile(user) {
    if (user.role == 3) {
        return sequelize.query(`
  SELECT cp.* ,u.id, u.email, u.mobile,u.role, u.isVerified, u.deviceType,u.deviceToken FROM users u 
JOIN customer_profiles cp on u.id = cp.userId 
where u.id = ${user.id};`, { type: sequelize.QueryTypes.SELECT });
    }
    else {
        return sequelize.query(`
    SELECT dp.* ,u.id, u.email, u.mobile,u.role, u.isVerified, u.deviceType,u.deviceToken FROM users u 
  JOIN driver_profiles dp on u.id = dp.userId 
  where u.id = ${user.id};`, { type: sequelize.QueryTypes.SELECT });
    }
}
exports.getProfile = getProfile;
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
function findUserSocketConnection(user) {
    return SocketConnections.findOne({ where: { userId: user.userId } });
}
exports.findUserSocketConnection = findUserSocketConnection;
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
        address: customer.address || '',
        latitude: customer.latitude || 0.00,
        longitude: customer.longitude || 0.00,
        businessType: customer.businessType,
        accountNumber: customer.accountNumber || "",
        ifsc: customer.ifsc || "",
        bank_name: customer.bank_name || "",
        phone_number: customer.phone_number || "",
        gst: customer.gst || "",
        firm_name: customer.firm_name || ""
    });
}
exports.setCustomerProfile = setCustomerProfile;

//# sourceMappingURL=users.js.map
