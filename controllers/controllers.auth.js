const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")
const randomHelper = require("../helper/random.js")

// POST: /api/auth/register
module.exports.registerPost = async (req, res) => {
    try {
        const {fullName, email, password} = req.body
        const existUser = await User.findOne({email: email})
        if(existUser){
            res.status(CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status).json({
                status: "error",
                msg: "Email đã tồn tại.",
                data: null
            })
        }else{
            const token = randomHelper.randomToken(30)
            const newUser = new User({
                fullName,
                email,
                password,
                token
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
            msg: "Email đã tồn tại."
        })
    }
}