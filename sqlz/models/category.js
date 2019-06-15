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
    });
};

//# sourceMappingURL=category.js.map
