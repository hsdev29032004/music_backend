const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.forgotPassword.js")

router.get("/", controller.index)

module.exports = router