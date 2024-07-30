const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Singer = require("../models/models.singers.js")
const Music = require("../models/models.musics.js")
const slugHelper = require("../helper/slug.js")
const { addImage } = require("../helper/cloudinary.js")


// GET: /api/singer?keyword=
module.exports.getListSinger = async (req, res) => {
    try {
        let keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i");

        const singers = await Singer.find({
            slug: keyword,
        })
            .select("-description")

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy dữ liệu thành công",
            data: singers
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// GET: /api/singer/:slug
module.exports.getSinger = async (req, res) => {
    try {
        const slug = req.params.slug
        const singer = await Singer.findOne({
            slug
        }).lean()

        const musics = await Music.find({
            deleted: false,
            singerId: singer._id
        }).select("name slug avatar")

        singer.infoMusic = musics

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy dữ liệu thành công",
            data: singer
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// POST: /api/singer/create
module.exports.createSinger = async (req, res) => {
    try {
        const { fullName, description} = req.body
        if (!req.file || !fullName) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "eror",
                msg: "Tồn tại trường bắt buộc chưa nhập",
                data: null
            })
        }

        const slug = slugHelper.slug(fullName)
        const avatar = await addImage(req.file.buffer)
        const newSinger = new Singer({
            fullName,
            slug,
            avatar,
            description
        })
        await newSinger.save()

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Tạo mới ca sĩ thành công",
            data: newSinger
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// PATCH: /api/singer/edit/:id
module.exports.editSinger = async (req, res) => {
    try {
        const { fullName, description } = req.body
        if(!fullName){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa nhập.",
                data: null
            })
        }

        let obj = {
            fullName,
            slug: slugHelper.slug(fullName),
            description
        }
        if(req.file){
            obj.avatar = await addImage(req.file.buffer)
        }
        
        await Singer.updateOne({_id: req.params.id}, obj)

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Chỉnh sửa ca sĩ thành công",
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