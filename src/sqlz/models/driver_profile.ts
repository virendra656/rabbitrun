

module.exports = (sequelize, type) => {
  const Sequelize = require('sequelize');
  const UserModel = require('./user')
  return sequelize.define('driver_profile', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    address: type.STRING,
    latitude: { type: type.DECIMAL(10, 8) },
    longitude: { type: type.DECIMAL(10, 8) },
    businessType: type.INTEGER,
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
  })
}
