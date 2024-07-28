const express = require("express")
const router = express.Router()
const multer = require("multer")

const controller = require("../controllers/controllers.user.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")
const { ROLE_SYSTEM } = require("../config/error.js")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
    "/",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.getListUser
)

router.get(
    "/:slug",
    authMiddlewares.checkLogin,
    controller.getUser
)

router.patch(
    "/edit/:id",
    authMiddlewares.checkLogin,
    upload.single("avatar"),
    controller.editUser
)

router.patch(
    "/change-password/:id",
    authMiddlewares.checkLogin,
    controller.changePassword
)

module.exports = router