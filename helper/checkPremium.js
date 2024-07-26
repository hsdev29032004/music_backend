const User = require("../models/models.users")
const { CONFIG_MESSAGE_ERRORS, ROLE_SYSTEM } = require("../config/error.js")

const checkPremium = async (req, res) => {
    try {
        if(!req.cookies.token){
            return false
        }

        const user = await User.findOne({ token: req.cookies.token })

        if (!user || parseInt(user.level) < ROLE_SYSTEM.VIP) {
            return false
        }

        return true
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

module.exports = checkPremium