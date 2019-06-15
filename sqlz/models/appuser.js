"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineUser(sequelize, DataTypes) {
    const AppUser = sequelize.define('AppUser', {
        email: DataTypes.STRING,
        pwd: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                AppUser.belongsTo(models.Language, {
                    foreignKey: 'languageId',
                    onDelete: 'CASCADE',
                });
            }
        }
    });
    return AppUser;
}
exports.default = defineUser;

//# sourceMappingURL=appuser.js.map
