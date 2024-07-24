const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")

const checkLogin = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
                status: "error",
                msg: "Bạn cần đăng nhập",
                data: null
            })
        }
        const user = await User.findOne({ token: req.cookies.token })
        if (!user) {
            return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
                status: "error",
                msg: "Bạn cần đăng nhập",
                data: null
            })
        }
        res.locals.user = user
        next()
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

const checkAuth = (requireLevel) => async (req, res, next) => {
    try {
        if (parseInt(res.locals.user.level) < requireLevel) {
            return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
                status: "error",
                msg: "Bạn không có quyền sử dụng tính năng này."
            })
        } else {
            next()
        }
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

module.exports = { 
    checkAuth, 
    checkLogin 
}