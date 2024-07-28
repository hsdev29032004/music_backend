const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.favorite.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.post(
    "/music/:musicId/:userId",
    authMiddlewares.checkLogin,
    controller.likeMusic
)

router.post(
    "/album/:albumId/:userId",
    authMiddlewares.checkLogin,
    controller.likeAlbum
)

router.post(
    "/singer/:singerId/:userId",
    authMiddlewares.checkLogin,
    controller.subcribeSinger
)

module.exports = router