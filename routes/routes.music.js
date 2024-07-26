const express = require("express")
const router = express.Router()
const { ROLE_SYSTEM, CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const multer = require("multer");

const controller = require("../controllers/controllers.music.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getListMusic)

router.get("/:slug", controller.getOneMusic)

router.patch(
    "/delete/:id", 
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.deleteOneMusic
)

router.post(
    "/create",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    upload.fields([{ name: 'avatar' }, { name: 'urlMp3' }]),
    controller.createMusic
)

module.exports = router