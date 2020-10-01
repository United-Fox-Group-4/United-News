const { User } = require('../models/index')
const { comparePass } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')

class UserController {
    static register(req, res, next) {
        const newUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        }
        User.create(newUser)
            .then(result => {
                return res.status(201).json({
                    id: result.id,
                    fullname: result.fullname,
                    email: result.email
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static login(req, res, next) {
        const userBody = {
			email: req.body.email,
			password: req.body.password,
		};

		User.findOne({ where: { email: userBody.email } })
			.then((data) => {
				if (data && comparePass(userBody.password, data.password)) {
					const access_token = signToken({ id: data.id, email: data.email });
					res.status(201).json({ id: data.id, email: data.email, access_token });
				} else {
					res.status(401).json({ message: "Invalid email or password" });
				}
			})
			.catch((err) => {
				next(err);
			});
    }
}

module.exports = UserController