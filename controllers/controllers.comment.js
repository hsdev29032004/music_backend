const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Comment = require("../models/models.comment.js")

// GET: /api/comment
module.exports.getListComment = async (req, res) => {
    try {
        const comments = await Comment.find({
            isCensored: false
        })
            .populate({
                path: "music",
                select: "name slug"
            })
            .populate({
                path: "user",
                select: "fullName avatar"
            })
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Lấy danh sách bình luận thành công",
            data: comments
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
} 

// GET: /api/comment/:musicId
module.exports.getComment = async (req, res) => {    
    try {
        const { musicId } = req.params
        const comments = await Comment.find({
            music: musicId
        })
            .populate({
                path: "user",
                select: "avatar fullName"
            })        
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Lấy danh sách bình luận thành công",
            data: comments
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// PATCH: /api/comment/allow/:id
module.exports.allowComment = async (req, res) => {
    try {
        const { id } = req.params
        const comments = await Comment.updateOne(
            {
                _id: id
            },
            {
                isCensored: true
            }
        )
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Thao thác thành công",
            data: comments
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// DELETE: /api/comment/refuse/:id
module.exports.refuseComment = async (req, res) => {
    try {
        const { id } = req.params
        const comments = await Comment.deleteOne(
            {
                _id: id
            }
        )
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Thao thác thành công",
            data: comments
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}