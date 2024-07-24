const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.auth.js")
const validateMiddlewares = require("../middlewares/middlewares.validate.js")

router.post("/register", validateMiddlewares.validateRegister, controller.registerPost)

router.post("/login", validateMiddlewares.validateLogin, controller.loginPost)

router.post("/logout", controller.logoutPost)

module.exports = router