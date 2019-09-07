

module.exports = (sequelize, type) => {
  const Sequelize = require('sequelize');
  const UserModel = require('./user')
  return sequelize.define('socket_connections', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    /* userId: {
      type: Sequelize.INTEGER,
      references: {
        model: UserModel,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    }, */
    //   userId: Sequelize.INTEGER,
    socketId: type.STRING,

    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  })
}
