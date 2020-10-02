const router = require('express').Router()
const UserController = require('../controllers/userController')
const authorization = require("../middlewares/authorization")

router.get("/collection/", UserController.getAllCollection)
router.get("/collection/id/:id", authorization, UserController.getCollectionById)

router.get("/collection/tag/:tag", UserController.getCollectionByTag)

router.post("/collection", UserController.addNewsCollection)

router.patch("/collection/id/:id", authorization, UserController.changeTag)

router.delete("/collection/id/:id", authorization, UserController.deleteNews)

module.exports = router