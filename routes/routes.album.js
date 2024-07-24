const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.album.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get("/", controller.getListAlbum)

router.get("/:id", controller.getOneAlbum)

module.exports = router