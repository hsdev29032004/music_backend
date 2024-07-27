const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Comment = require("../models/models.comment.js")

// GET: /api/comment/:musicId
module.exports.getComment = async (req, res) => {
    try {
        const { musicId } = req.params
        const comments = await Comment.find({
            musicId: musicId
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