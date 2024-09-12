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
        const user = await User.findOne({ email: email }).select("fullName avatar level password token slug")
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

        res.cookie("token", user.token, {
            httpOnly: true,
            sameSite: 'Lax', // Cần thiết khi truyền cookies qua nhiều miền khác nhau
            secure: true      // Bắt buộc khi sử dụng HTTPS (như với ngrok)
        });
        
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

module.exports.checkLogin = async (req, res) => {
    try {
        const token = req.cookies.token
        let obj = {
            id: "",
            createdAt: "",
            email: "",
            fullName: "",
            level: 0,
            avatar: "",
            slug: "",
            likedAlbum: [],
            likedMusic: [],
            password: "",
            slug: "",
            subcribedSinger: [],
            token: "",
            updatedAt: "",
            deleted: "false"
        }
        if(!token){
            return res.json(obj)
        }
        
        const user = await User.findOne({
            token
        })
            .populate({
                path: "likedAlbum",
                select: "name slug singerId avatar",
                populate: {
                    path: "singerId",
                    select: "fullName slug"
                }
            })
            .populate({
                path: "likedMusic",
                select: "name slug avatar quantityLike singerId otherSingersId premium",
                populate: [
                    {
                        path: "singerId",
                        select: "fullName slug" 
                    },
                    {
                        path: "otherSingersId",
                        select: "fullName slug"
                    }
                ]
            })
            .populate({
                path: "subcribedSinger",
                select: "fullName slug avatar quantitySubcriber"
            })
        if(!user){
            return res.json(obj)
        }

        res.json(user)
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        })
    }
}
