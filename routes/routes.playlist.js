const express = require("express")
const router = express.Router()
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const controller = require("../controllers/controllers.playlist.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get(
    "/:id",
    authMiddlewares.checkLogin,
    controller.getListPlaylist
)

router.get(
    "/detail/:slug",
    authMiddlewares.checkLogin,
    controller.getPlaylist
)

router.delete(
    "/delete/:id",
    authMiddlewares.checkLogin,
    controller.deletePlaylist
)

router.post(
    "/create",
    authMiddlewares.checkLogin,
    controller.createPlaylist
)

router.patch(
    "/edit/:id",
    authMiddlewares.checkLogin,
    controller.editPlaylist
)

module.exports = router

