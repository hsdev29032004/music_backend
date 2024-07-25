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

router.get("/:id", controller.getOneAlbum)

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
          })
        }
      
        try {
          const result = await addImage(req.file.buffer); // Sử dụng hàm helper để upload ảnh
          req.body.avatar = result.secure_url; // Lưu URL Cloudinary vào req.file
          next();
        } catch (error) {
          return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống này",
            data: null
          })
        }
      },
    controller.createAlbum
)

router.delete(
  "/delete/:id",
  authMiddlewares.checkLogin, 
  authMiddlewares.checkAuth(ROLE_SYSTEM.ADMIN),
  controller.deleteAlbum
)

module.exports = router