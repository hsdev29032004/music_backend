const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")
const slugHelper = require("../helper/slug.js")
const user = require("../helper/user.js")
const { addImage } = require("../helper/cloudinary.js")
const md5 = require("md5")

// GET: /api/user?keyword=
module.exports.getListUser = async (req, res) => {
    try {
        let keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i");

        const users = await User.find({
            deleted: false,
            slug: keyword
        }).select("fullName email level avatar slug")

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy danh sách người dùng thành công.",
            data: users
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// GET: /api/user/:slug
module.exports.getUser = async (req, res) => {
    try {
        const record = await User.findOne({
            slug: req.params.slug
        })
        if(!record){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "INVALID",
                data: null
            })
        }

        const isPermit = await user.checkPermission(res.locals.user._id.toString(), record._id.toString())
        if (isPermit){
            return res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
                status: "success",
                msg: "Lấy thông tin người dùng thành công.",
                data: record
            })
        }

        res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
            status: "error",
            msg: "INVALID",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        })
    }
}

// PATCH: /api/user/edit/:id
module.exports.editUser = async (req, res) => {
    try {
        const record = await User.findOne({
            _id: req.params.id
        })
        if(!record){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không tồn tại người dùng",
                data: null
            })
        }

        const isPermit = await user.checkPermission(res.locals.user._id.toString(), record._id.toString())
        if (isPermit){
            const { fullName } = req.body
            if(!fullName) {
                return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                    status: "error",
                    msg: "Tồn tại trường bắt buộc chưa nhập.",
                    data: record
                })
            }
            const slug = slugHelper.slug(fullName)
            record.fullName = fullName
            record.slug = slug
            if (req.file){
                record.avatar = await addImage(req.file.buffer)
            }

            await record.save()

            return res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
                status: "success",
                msg: "Chỉnh sửa thông tin thành công.",
                data: record
            })
        }

        res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
            status: "error",
            msg: "Bạn không có quyền thay đổi mật khẩu của người dùng này.",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        })
    }
}

// PATCH: /api/user/change-password/:id
module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword, reNewPassword } = req.body;

        // Tìm người dùng
        const record = await User.findById(userId);
        if (!record) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Người dùng không tồn tại.",
                data: null
            });
        }

        // Xác thực mật khẩu mới
        if (!newPassword || newPassword.length < 6) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Mật khẩu mới phải có ít nhất 6 ký tự.",
                data: null
            });
        }

        // Xác thực mật khẩu hiện tại
        if (record.password !== md5(currentPassword)) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Mật khẩu hiện tại không chính xác.",
                data: null
            });
        }

        // Xác thực mật khẩu nhập lại
        if (reNewPassword !== newPassword) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Nhập lại mật khẩu không khớp.",
                data: null
            });
        }

        // Kiểm tra quyền truy cập
        const isPermit = await user.checkPermission(res.locals.user._id.toString(), record._id.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Bạn không có quyền thay đổi mật khẩu của người dùng này.",
                data: null
            });
        }

        // Cập nhật mật khẩu mới
        record.password = md5(newPassword);
        await record.save();

        return res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Mật khẩu đã được thay đổi thành công.",
            data: null
        });
        
    } catch (error) {
        console.error(error);
        return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message || 'Có lỗi xảy ra.'
        });
    }
};