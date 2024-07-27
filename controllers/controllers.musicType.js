const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const MusicType = require("../models/models.musicTypes.js")
const Music = require("../models/models.musics.js")
const slugHelper = require("../helper/slug.js")
const user = require("../helper/user.js")
const { addImage } = require("../helper/cloudinary.js")

// GET: /api/music-type?keyword=
module.exports.getListMusicType = async (req, res) => {
    try {
        keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i")
        const listMusicType = await MusicType.find({
            slug: keyword
        })
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy danh sách loại nhạc thành công",
            data: listMusicType
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// GET: /api/music-type/:slug
module.exports.getMusicType = async (req, res) => {
    try {
        let musicType = await MusicType.findOne({
            slug: req.params.slug
        }).lean()
        
        const musics = await Music.find({
            deleted: false,
        })
            .populate({
                path: 'singerId',
                select: 'fullName slug'
            })
            .populate({
                path: 'otherSingersId',
                select: 'fullName slug'
            })
            .select("name slug avatar singerId musicType")

        let arrMusic = musics.filter(item => item.musicType.includes(musicType._id));

        const isPremium = await user.checkPremium(req, res);

        arrMusic.forEach(element => {
            if(!isPremium && element.premium){
                element.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a"
            }
        });
        
        musicType.infoMusic = arrMusic

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy loại nhạc thành công",
            data: musicType
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// POST: /api/music-type/create
module.exports.createMusicType = async (req, res) => {
    try {
        const name = req.body.name
        if(!req.file || !req.body.name){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: `Có trường bắt buộc chưa được nhập`,
                data: null
            });
        }
        const slug = slugHelper.slug(name)

        const result = await addImage(req.file.buffer);

        const musicType = new MusicType({
            name,
            slug,
            avatar: result
        })
        await musicType.save()
        res.json({
            status: "success",
            msg: "Tạo thể loại bài hát thành công.",
            data: musicType
        })
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống",
            data: null
        });
    }
}