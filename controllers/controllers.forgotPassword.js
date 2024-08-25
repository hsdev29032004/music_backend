const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const ForgotPassword = require("../models/models.forgotPasswords.js")
const User = require("../models/models.users.js")
const randomHelper = require("../helper/random.js")
const md5 = require("md5")
const { sendMail } = require("../helper/sendEmail.js")

// POST: api/forgot-password
module.exports.forgot = async (req, res) => {
    try {
        const { email } = req.body
        if(!email){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Chưa nhập email.",
                data: null
            });
        }

        const user = await User.findOne({
            email
        })
        if(!user){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không tồn tại email.",
                data: null
            });
        }

        const exist = await ForgotPassword.findOne({
            email
        })
        if(exist){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Đã tồn tại yêu cầu, thử lại sau.",
                data: null
            });
        }

        const record = new ForgotPassword({
            email,
            otp: randomHelper.randomNumber(10),
            expireAt: new Date(Date.now() + 180 * 1000),
            token: randomHelper.randomToken(30)
        });
        await record.save()
        
        sendMail(
            record.email,
            "Yêu cầu lấy lại mật khẩu",
            `Mã otp của bạn là <b>${record.otp}</b>`
        )

        res.cookie("tokenReset", record.token, {
            maxAge: 3 * 60 * 1000
        });

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Gửi yêu cầu thành công",
            data: record.token
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}

// POST: /api/forgot-password/otp
module.exports.postOtp = async (req, res) => {
    try {
        const otp = req.body.otp
        const tokenReset = req.cookies.tokenReset
        if(!tokenReset){
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
                status: "error",
                msg: "Không tồn tại yêu cầu hoặc đã hết hạn.",
                data: null
            });
        }

        const record = await ForgotPassword.findOne({
            token: tokenReset,
            isUsed: false
        })
        if(!record){
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
                status: "error",
                msg: "Không tồn tại yêu cầu hoặc đã hết hạn.",
                data: null
            });
        }

        if (record.otp != otp.toString()){
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
                status: "error",
                msg: "Mã otp không tồn tại.",
                data: null
            });
        }

        record.isAllow = true
        await record.save()

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Thành công",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}

// POST: /api/forgot-password/reset
module.exports.reset = async (req, res) => {
    try {
        console.log("chạy vào đây");
        const tokenReset = req.cookies.tokenReset
        if(!tokenReset){
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
                status: "error",
                msg: "Không tồn tại yêu cầu hoặc đã hết hạn.",
                data: null
            });
        }

        const record = await ForgotPassword.findOne({
            token: tokenReset,
            isUsed: false,
            isAllow: true
        })
        if(!record){
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
                status: "error",
                msg: "Không tồn tại yêu cầu hoặc đã hết hạn.",
                data: null
            });
        }

        await User.updateOne(
            {email: record.email},
            {password: md5(req.body.password)}
        )

        record.isUsed = true
        await record.save()

        res.clearCookie("tokenReset")

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Cập nhật mật khẩu thành công",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}