const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js");
const Music = require("../models/models.musics.js");
const Singer = require("../models/models.singers.js");

// GET: /api/music?keyword=
module.exports.getListMusic = async (req, res) => {
    try {
        let keyword = new RegExp(req.query.keyword, "i");

        // Tìm kiếm bài hát theo tên và lời bài hát
        const nameResults = await Music.find({ name: keyword })
            .populate('singerId')  // Populate thông tin ca sĩ chính
            .populate('otherSingersId');  // Populate thông tin ca sĩ khác

        const lyricsResults = await Music.find({ lyrics: keyword })
            .populate('singerId')  // Populate thông tin ca sĩ chính
            .populate('otherSingersId');  // Populate thông tin ca sĩ khác

        // Kết hợp và lọc kết quả để loại bỏ bản sao
        const allResults = [...nameResults, ...lyricsResults];
        const uniqueResults = allResults.reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) acc.push(current);
            return acc;
        }, []);

        // Trả về kết quả
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Tìm list bài hát thành công",
            data: uniqueResults
        });
    } catch (error) {
        // Log chi tiết lỗi
        console.error("Error in getListMusic:", error);

        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            error: error.message  // Trả về thông báo lỗi chi tiết
        });
    }
};
