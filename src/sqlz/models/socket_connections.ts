

module.exports = (sequelize, type) => {
  const Sequelize = require('sequelize');
  const UserModel = require('./user')
  return sequelize.define('socket_connections', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    socketId: type.STRING,
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  })
}
