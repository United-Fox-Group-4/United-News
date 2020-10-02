'use strict';
const {
    Model
} = require('sequelize');
const { hashPass } = require("../helpers/bcrypt");
const { options } = require('../routes');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasMany(models.NewsCollection, {
				sourceKey: "id",
				foreignKey: "UserId",
			});
        }
    };
    User.init({
        fullname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Must be in email format"
                },
                notEmpty: {
                    args: true,
                    msg: "Email cannot be empty"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 20],
                    msg: "Password must be between 6 and 20 characters in length"
                },
                notEmpty: {
                    args: true,
                    msg: "Password cannot be empty"
                }
            }
        }
    }, {
        hooks: {
            beforeCreate: (user, options) => {
                user.dataValues.password = hashPass(user.dataValues.password)
            }
        },
        sequelize,
        modelName: 'User',
    });
    return User;
};