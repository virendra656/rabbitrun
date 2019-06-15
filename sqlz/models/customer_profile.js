module.exports = (sequelize, type) => {
    const Sequelize = require('sequelize');
    const UserModel = require('./user');
    return sequelize.define('customer_profile', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        address: type.STRING,
        latitude: { type: type.DECIMAL(10, 2) },
        longitude: { type: type.DECIMAL(10, 2) },
        businessType: type.INTEGER,
        accountNumber: type.STRING,
        ifsc: type.STRING,
        bank_name: type.STRING,
        phone_number: type.STRING,
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
    });
};

//# sourceMappingURL=customer_profile.js.map
