const express = require("express")
const router = express.Router()

const controller = require("../controllers/controllers.comment.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")
const { ROLE_SYSTEM } = require("../config/error.js")

router.get(
    "/",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.getListComment
)

router.get(
    "/:musicId", 
    controller.getComment
)

router.patch(
    "/allow/:id",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.allowComment
)

router.delete(
    "/refuse/:id",
    authMiddlewares.checkLogin,
    authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
    controller.refuseComment
)

module.exports = router