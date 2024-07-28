const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")
const randomHelper = require("../helper/random.js")
const md5 = require("md5")
const slugHelper = require("../helper/slug.js")

// POST: /api/auth/register
module.exports.registerPost = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        const existUser = await User.findOne({ email: email })
        if (existUser) {
            res.status(CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status).json({
                status: "error",
                msg: "Email đã tồn tại.",
                data: null
            })
        } else {
            const token = randomHelper.randomToken(30)
            const slug = slugHelper.slug(fullName)
            const newUser = new User({
                fullName,
                email,
                password: md5(password),
                token,
                slug
            })
            await newUser.save()
            res.cookie("token", token)
            res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Đăng ký tài khoản thành công",
                data: null
            })
        }
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// POST: /api/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }).select("name avatar level password token")
        if (!user) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Email không tồn tại",
                data: null
            })
        }

        if (md5(password) != user.password) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Sai mật khẩu",
                data: null
            })
        }

        res.cookie("token", user.token)
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Đăng nhập thành công",
            data: user
        })

    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// POST: /api/auth/logout
module.exports.logoutPost = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Đăng xuất thành công.",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

