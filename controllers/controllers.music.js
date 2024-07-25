const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js");
const Music = require("../models/models.musics.js");
const Singer = require("../models/models.singers.js");

// GET: /api/music?keyword=
module.exports.getListMusic = async (req, res) => {
    try {
        let keyword = new RegExp(req.query.keyword, "i");

        const nameResults = await Music.find({ name: keyword, deleted: false })
            .populate('singerId')
            .populate('otherSingersId');

        const lyricsResults = await Music.find({ lyrics: keyword, deleted: false })
            .populate('singerId')
            .populate('otherSingersId');

        const allResults = [...nameResults, ...lyricsResults];
        const uniqueResults = allResults.reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) acc.push(current);
            return acc;
        }, []);

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Tìm list bài hát thành công",
            data: uniqueResults
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
};

// GET: /api/music/:slug
module.exports.getOneMusic = async (req, res) => {
    try {
        const { slug } = req.params
        const music = await Music.findOne({
            slug: slug,
            deleted: false
        })
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy bài hát thành công",
            data: music
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}

// PATCH: /api/music/delete/:id
module.exports.deleteOneMusic = async (req, res) => {
    try {
        await Music.updateOne({_id: req.params.id}, {deleted: true})
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Xóa bài hát thành công",
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