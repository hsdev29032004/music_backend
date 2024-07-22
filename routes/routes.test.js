const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.test")

router.get("/", controller.index)

module.exports = router