module.exports = (sequelize, type, UserModel) => {
    const Sequelize = require('sequelize');
    return sequelize.define('booking', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: UserModel,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        driverId: {
            type: Sequelize.INTEGER,
            references: {
                model: UserModel,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        latitude: { type: type.DECIMAL(10, 8) },
        longitude: { type: type.DECIMAL(10, 8) },
        source: type.STRING,
        destination: type.STRING,
        status: type.STRING,
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

//# sourceMappingURL=booking.js.map
