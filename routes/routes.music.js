const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.music.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get("/", controller.getListMusic)

module.exports = router