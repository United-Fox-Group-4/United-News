const router = require('express').Router()
const user = require('./user')
const news = require("./news")
const UserController = require("../controllers/userController")
const {Authentication} = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(Authentication)

router.use('/user', user)
router.use("/news", news)

module.exports = router