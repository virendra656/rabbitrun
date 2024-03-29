module.exports = (sequelize, type) => {
    const Sequelize = require('sequelize');
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: type.STRING,
        mobile: type.STRING,
        password: type.STRING,
        role: {
            type: type.INTEGER,
            defaultValue: 3
        },
        isActive: {
            type: type.INTEGER,
            defaultValue: 1
        },
        isVerified: {
            type: type.INTEGER,
            defaultValue: 0
        },
        verifyOTP: {
            type: type.STRING,
        },
        forgotPasswordOTP: {
            type: type.STRING
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
        deviceType: {
            type: type.STRING
        },
        deviceToken: {
            type: type.STRING
        }
    });
};

//# sourceMappingURL=user.js.map
