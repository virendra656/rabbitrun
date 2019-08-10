

module.exports = (sequelize, type) => {
  const Sequelize = require('sequelize');

  return sequelize.define('categories', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    title: type.STRING,
    description: type.STRING,
    isActive: {
      type: type.INTEGER,
      defaultValue: 1
    },
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

/*
import * as Sequelize from 'sequelize'

export interface UserAttributes {
  id?: number
  email?: string,
  mobile?: string,
  password?: string,
  active?: boolean,
}

export interface UserInstance extends Sequelize.Instance<UserAttributes> {
  id: number
  createdAt: Date
  updatedAt: Date

  email: string,
  mobile: string,
  password: string,
  active: boolean
}

export default function defineUser(sequelize: Sequelize.Sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password: DataTypes.STRING
  });
  return User
}
 */