const express = require("express")
const router = express.Router()
const multer = require("multer");
const { ROLE_SYSTEM, CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const { addImage } = require("../helper/cloudinary.js")

const controller = require("../controllers/controllers.album.js")
const authMiddlewares = require("../middlewares/middlewares.auth.js")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getListAlbum)

router.get("/:slug", controller.getOneAlbum)

router.post(
  "/create",
  authMiddlewares.checkLogin,
  authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
  upload.single("avatar"),
  async (req, res, next) => {
    if (!req.file || !req.body.name || !req.body.singerId) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "error",
        msg: `Có trường bắt buộc chưa được nhập`,
        data: null
      });
    }

    try {
      const result = await addImage(req.file.buffer);
      console.log("Cloudinary upload result:", result);
      req.body.avatar = result;
      next();
    } catch (error) {
      return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
        status: "error",
        msg: "Lỗi hệ thống",
        data: null
      });
    }
  },
  controller.createAlbum
);

router.patch(
  "/edit/:id",
  authMiddlewares.checkLogin,
  authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
  upload.single("avatar"),
  async (req, res, next) => {
    if (!req.body.name) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "error",
        msg: `Có trường bắt buộc chưa được nhập`,
        data: null
      })
    }
    if (!req.file) {
      return next()
    }
    try {
      const result = await addImage(req.file.buffer);
      req.body.avatar = result;
      next();
    } catch (error) {
      return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
        status: "error",
        msg: "Lỗi hệ thống",
        data: null
      })
    }
  },
  controller.editAlbum
)

router.delete(
  "/delete/:id",
  authMiddlewares.checkLogin,
  authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
  controller.deleteAlbum
)

router.post(
  "/add/musicToAlbum",
  authMiddlewares.checkLogin,
  authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
  controller.addMusicToAlbum
)

module.exports = router