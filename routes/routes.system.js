const express = require("express")
const router = express.Router()
const { ROLE_SYSTEM } = require("../config/error.js")

const controller = require("../controllers/controllers.system.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

router.get("/", authMiddlewares.checkLogin, authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN), controller.systemGet)

router.patch("/", authMiddlewares.checkLogin, authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN), controller.systemPatch)

router.get("/info", authMiddlewares.checkLogin, authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN), controller.systemInfo)

module.exports = router