"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class NewsCollection extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			NewsCollection.belongsTo(models.User, {
				targetKey: "id",
				foreignKey: "UserId",
			});
		}
	}
	NewsCollection.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "Title cannot be empty",
					},
					notNull: {
						msg: "Title cannot be empty",
					},
				},
			},
			description: DataTypes.STRING,
			publishedAt: {
				type: DataTypes.DATEONLY,
				validate: {
					isDate: {
						args: true,
						msg: "Published date format is invalid",
					},
				},
			},
			tag: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "Tag cannot be empty",
					},
					notNull: {
						msg: "Tag cannot be empty",
					},
				},
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: {
						args: 1,
						msg: "User Id start at 1",
					},
					notNull: {
						msg: "User Id is Required",
					},
				},
			},
			news_url: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "URL cannot be empty",
					},
					notNull: {
						msg: "URL cannot be empty",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "NewsCollection",
		},
	);
	return NewsCollection;
};
