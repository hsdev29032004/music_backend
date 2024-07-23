const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.comment.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get("/", controller.index)

module.exports = router