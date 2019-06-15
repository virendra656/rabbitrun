const config = require('../config/config.json');
const Sequelize = require('sequelize');
const UserModel = require('./user');
const CategoryModel = require('./category');
const CustomerProfileModel = require('./customer_profile');
require('dotenv').config();
const dbConfig = {
    username: process.env.dbusername,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: process.env.port,
    dialect: process.env.dialect,
    logging: true,
    force: false,
    timezone: process.env.timezone
};
console.log(dbConfig);
const sequelize = new Sequelize(dbConfig['database'], dbConfig['username'], dbConfig['password'], dbConfig);
const User = UserModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const CustomerProfile = CustomerProfileModel(sequelize, Sequelize);
CustomerProfile.belongsTo(User);
module.exports = {
    User, CustomerProfile, Category
};

//# sourceMappingURL=_index.js.map
