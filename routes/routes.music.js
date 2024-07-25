const express = require("express")
const router = express.Router()
const { ROLE_SYSTEM, CONFIG_MESSAGE_ERRORS } = require("../config/error.js")

const controller = require("../controllers/controllers.music.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get("/", controller.getListMusic)

router.get("/:slug", controller.getOneMusic)

router.patch(
    "/delete/:id", 
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.deleteOneMusic
)

module.exports = router