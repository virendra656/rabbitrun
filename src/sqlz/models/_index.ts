
const config = require('../config/config.json')

const Sequelize = require('sequelize')
const UserModel = require('./user')
const CategoryModel = require('./category')
const CustomerProfileModel = require('./customer_profile')
const DriverProfileModel = require('./driver_profile')
require('dotenv').config()

const dbConfig = {
  username : process.env.dbusername,
  password : process.env.password,
  database : process.env.database,
  host : process.env.host,
  port : process.env.port,
  dialect : process.env.dialect,
  logging : true,
  force : false,
  timezone : process.env.timezone
}
console.log(dbConfig);





const sequelize = new Sequelize(
  dbConfig['database'],
  dbConfig['username'],
  dbConfig['password'],
  dbConfig)

const User = UserModel(sequelize, Sequelize)
const Category = CategoryModel(sequelize, Sequelize)
const CustomerProfile = CustomerProfileModel(sequelize, Sequelize)
const DriverProfile = DriverProfileModel(sequelize, Sequelize)
CustomerProfile.belongsTo(User);
DriverProfile.belongsTo(User);

   /* sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })  */ 

module.exports = {
  User,CustomerProfile,Category, DriverProfile
}