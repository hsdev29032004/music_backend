const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")

const checkLogin = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/login")
        }
        const user = await User.findOne({ token: req.cookies.token })
        if (!user) {
            return res.redirect("/login")
        }
        res.locals.user = user
        next()
    } catch (error) {
        return res.json({
            code: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status,
            status: "error",
            msg: "Lỗi hệ thống."
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
        return res.json({
            code: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status,
            status: "error",
            msg: "Lỗi hệ thống."
        })
    }
}

module.exports = { checkAuth, checkLogin }