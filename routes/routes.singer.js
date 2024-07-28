const express = require("express")
const router = express.Router()
const multer = require("multer")

const controller = require("../controllers/controllers.singer.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")
const { ROLE_SYSTEM } = require("../config/error.js")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getListSinger)

router.get("/:slug", controller.getSinger)

router.post(
    "/create", 
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    upload.single("avatar"),
    controller.createSinger
)

router.patch(
    "/edit/:id",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    upload.single("avatar"),
    controller.editSinger
)

module.exports = router