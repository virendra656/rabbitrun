"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineUser(sequelize, DataTypes) {
    const Language = sequelize.define('Language', {
        label: DataTypes.STRING(255),
        name: DataTypes.STRING(50)
    }, {
        classMethods: {
            associate: function (models) {
                Language.hasMany(models.AppUser, {
                    foreignKey: 'languageId',
                    as: 'appUsers'
                });
            }
        }
    });
    return Language;
}
exports.default = defineUser;

//# sourceMappingURL=language.js.map
