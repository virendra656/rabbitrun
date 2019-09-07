import * as uuid from 'uuid'

const { User, CustomerProfile, Category, DriverProfile, SocketConnections, sequelize } = require('../sqlz/models/_index');
import * as CryptoJS from 'crypto-js';


const sequelizeModule = require('sequelize')

export function findCustomerByEmailOrPhone(user: any): Promise<any> {
  return User.findOne({
    raw: true,
    limit: 1,
    where: {

      $or: [
        {
          email:
          {
            $eq: user.email.toLowerCase()
          }
        },
        {
          mobile:
          {
            $eq: user.mobile.replace(/ +?/g, '')
          }
        }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
}

export function login(user: any): Promise<any> {
  return User.findOne({
    raw: true,
    limit: 1,
    where: {
      password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString(),
      $or: [
        {
          email:
          {
            $eq: user.email_or_mobile.toLowerCase()
          }
        },
        {
          mobile:
          {
            $eq: user.email_or_mobile.replace(/ +?/g, '')
          }
        }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
}

export function getBusinessCategories(): Promise<any> {
  return Category.findAll({
    raw: true,
    limit: 1,
    where: { isActive: 1 },
    order: [['createdAt', 'DESC']]
  });
}

export function findUserByOTP(user: any): Promise<any> {
  let obj = user.verifyOTP ? { verifyOTP: user.verifyOTP } : { forgotPasswordOTP: user.forgotPasswordOTP }
  return User.findOne({
    raw: true,
    limit: 1,
    where: obj,
    order: [['createdAt', 'DESC']]
  });
}



export function getDriverById(userId: number): Promise<any> {
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

export function getCustomerById(userId: number): Promise<any> {
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

export function register(user: any): Promise<any> {
  return User
    .create({
      email: user.email.toLowerCase(),
      verifyOTP: user.verifyOTP,
      isVerified: user.isVerified ? 1 : 0,
      role: user.role || 3,
      mobile: user.mobile.replace(/ +?/g, ''),
      password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString()
    })
}

export function updateDevice(user: any): Promise<any> {
  return User.update(
    { deviceType: user.deviceType, deviceToken: user.deviceToken },
    { where: { id: user.id } }
  );
}

export function nearByDrivers(user: any): Promise<any> {
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
  ORDER BY distance ASC;`, {type: sequelize.QueryTypes.SELECT})

  /* return DriverProfile.findAll({
    attributes: [[sequelizeModule.literal("6371 * acos(cos(radians(" + lat + ")) * cos(radians(latitude)) * cos(radians(" + lng + ") - radians(longitude)) + sin(radians(" + lat + ")) * sin(radians(latitude)))"), 'distance'], 'name', 'userId'],
    order: sequelizeModule.col('distance'),
    raw: true,
    limit: 10,
    include: [{ model: SocketConnections, attributes: [['socketId', 'userId']] }]

  }); */
}

export function saveSocketConnection(user: any): Promise<any> {
  return SocketConnections.findOne({ where: { userId: user.userId } })
    .then(function (obj) {
      if (obj) { // update
        return obj.update(user);
      }
      else { // insert
        return SocketConnections.create(user);
      }
    });
}

export function updateDriverLocation(user: any): Promise<any> {
  return DriverProfile.update(
    { latitude: user.latitude, longitude: user.longitude },
    { where: { id: user.id } }
  );
}



export function updateOTP(user: any): Promise<any> {
  return User.update(
    { forgotPasswordOTP: user.forgotPasswordOTP },
    { where: { id: user.id } }
  );
}

export function verifyAccount(user: any): Promise<any> {
  return User.update(
    { isVerified: 1 },
    { where: { id: user.id } }
  );
}


export function changePassword(user: any): Promise<any> {
  return User.update(
    { password: CryptoJS.SHA512(user.password, process.env.EncryptionKEY).toString(), isVerified: 1 },
    { where: { forgotPasswordOTP: user.forgotPasswordOTP } }
  );
}

export function setDriverProfile(driver: any, user: any): Promise<any> {

  return DriverProfile.create({
    name: driver.name,
    userId: user.id,
    address: driver.address,
    latitude: driver.latitude,
    longitude: driver.longitude,
    businessType: driver.businessType
  })
}

export function setCustomerProfile(customer: any, user: any): Promise<any> {

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
  })
}

