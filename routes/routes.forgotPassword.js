const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.forgotPassword.js")
const { validateResetPassword } = require("../middlewares/middlewares.validate.js")

router.post("/", controller.forgot)

router.post("/otp", controller.postOtp)

router.post(
    "/reset",
    validateResetPassword,
    controller.reset
)

module.exports = router