"use strict";

const { NewsCollection } = require("../models");

const authorization = (req, res, next) => {
	NewsCollection.findByPk(req.params.id)
		.then((data) => {
			if (!data) {
				res.status(404).json({ message: "Data Not Found" });
			} else if (data.UserId !== req.userData.id) {
				res.status(401).json({ message: "You do not have access" });
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({ message: err });
		});
};

module.exports = authorization;
