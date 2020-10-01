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

    }
}

module.exports = UserController