const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js");
const Music = require("../models/models.musics.js");
const Singer = require("../models/models.singers.js");
const checkPremium = require("../helper/checkPremium.js")
const { addImage, addMp3} = require("../helper/cloudinary.js")
const slugHelper = require("../helper/slug.js");
const Album = require("../models/models.albums.js");

// GET: /api/music?keyword=
module.exports.getListMusic = async (req, res) => {
    try {
        let keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i");
        let regexLyric = new RegExp(req.query.keyword, "i");

        const nameResults = await Music.find({ slug: keyword, deleted: false })
            .populate('singerId')
            .populate('otherSingersId');

        const lyricsResults = await Music.find({ lyrics: regexLyric, deleted: false })
            .populate('singerId')
            .populate('otherSingersId');

        const allResults = [...nameResults, ...lyricsResults];
        const uniqueResults = allResults.reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) acc.push(current);
            return acc;
        }, []);

        const isPremium = await checkPremium(req, res);

        if(!isPremium){
            uniqueResults.forEach(item => {
                if(item.premium){
                    item.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a"
                }
            })
        }
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

        const isPremium = await checkPremium(req, res);

        if(!isPremium && music.premium){
            music.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a",
            music.lyrics = ""
        }

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

// POST: /api/music/create
module.exports.createMusic = async (req, res) => {
    try {
        if (!req.files.avatar || !req.files.avatar[0]) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({ 
                status: "error",
                msg: 'Bắt buộc gửi lên ảnh đại diện',
                data: null
            });
        }
        if (!req.files.urlMp3 || !req.files.urlMp3[0]) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({ 
                status: "error",
                msg: 'Bắt buộc gửi lên file mp3',
                data: null
            });
        }
        const { name, lyrics, description, singerId, otherSingersId, album, musicType, premium } = req.body;
        if(!name || !lyrics || !singerId){
            res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa được nhập",
                data: null
            })
        }
        const arrOtherSingerIds = otherSingersId ? otherSingersId.split(',').map(id => id.trim()) : []
        const avatarUrl = await addImage(req.files.avatar[0].buffer);
        const mp3Url = await addMp3(req.files.urlMp3[0].buffer);
        let slug = slugHelper.slug(name)
        const newMusic = new Music({
            name,
            slug: slug,
            lyrics,
            description,
            singerId,
            otherSingersId: arrOtherSingerIds,
            album,
            musicType,
            premium,
            avatar: avatarUrl,
            urlMp3: mp3Url
        });

        await newMusic.save();
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: 'Tạo bài hát thành công', 
            data: newMusic 
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({ 
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// PATCH: /api/music/edit/:id
module.exports.editMusic = async (req, res) => {
    try {
        const { name, lyrics, description, singerId, otherSingersId, album, musicType, premium } = req.body;
        const arrOtherSingerIds = otherSingersId ? otherSingersId.split(',').map(id => id.trim()) : [];
        const arrMusicType = musicType ? musicType.split(',').map(id => id.trim()) : [];

        if (!name || !lyrics || !singerId) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa được nhập",
                data: null
            });
        }

        let newMusic = {
            name: name,
            lyrics: lyrics,
            singerId: singerId,
            slug: slugHelper.slug(name)
        };

        if (arrOtherSingerIds.length > 0) newMusic.otherSingersId = arrOtherSingerIds;
        if (description) newMusic.description = description;
        if (album) newMusic.album = album;
        if (arrMusicType.length > 0) newMusic.musicType = arrMusicType;
        if (typeof premium === "boolean") newMusic.premium = premium;

        if (req.files && req.files.avatar && req.files.avatar[0]) {
            const url = await addImage(req.files.avatar[0].buffer);
            newMusic.avatar = url;
        }

        if (req.files && req.files.urlMp3 && req.files.urlMp3[0]) {
            const url = await addMp3(req.files.urlMp3[0].buffer);
            newMusic.urlMp3 = url;
        }

        const result = await Music.updateOne({ _id: req.params.id }, newMusic);
        
        if (result.nModified === 0) {
            return res.status(CONFIG_MESSAGE_ERRORS.NOT_FOUND.status).json({
                status: "error",
                msg: "Không tìm thấy bài hát để cập nhật",
                data: null
            });
        }

        res.status(200).json({
            status: "success",
            msg: "Cập nhật bài hát thành công",
            data: newMusic
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
};
