const express = require("express")
const router = express.Router()
const { ROLE_SYSTEM, CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const multer = require("multer")

const controller = require("../controllers/controllers.musicType.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getListMusicType)

router.get("/:slug", controller.getMusicType)

router.post(
    "/create",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    upload.single("avatar"),
    controller.createMusicType
)

module.exports = router