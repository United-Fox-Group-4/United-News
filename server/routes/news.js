const router = require('express').Router()
const UserController = require('../controllers/userController')

router.get("/headline", UserController.headline)
router.post("/search", UserController.searchNews)

module.exports = router