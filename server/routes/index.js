const router = require('express').Router()
const user = require('./user')
const userController = require("../controllers/userController")

router.use('/user', user)
router.get("/news/headline", userController.headline)

module.exports = router