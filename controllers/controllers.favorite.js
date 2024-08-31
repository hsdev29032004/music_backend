const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const User = require("../models/models.users.js")
const Music = require("../models/models.musics.js")
const Singer = require("../models/models.singers.js")
const Album = require("../models/models.albums.js")
const user = require("../helper/user.js")

// POST: /api/favorite/music/:musicId/:userId
module.exports.likeMusic = async (req, res) => {
    try {
        const { userId, musicId } = req.params;

        const userRecord = await User.findById(userId);
        if (!userRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Người dùng không tồn tại.",
                data: null
            });
        }
        
        const isPermit = await user.checkPermission(res.locals.user._id.toString(), userRecord._id.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không thể thao thác.",
                data: null
            });
        }

        const musicRecord = await Music.findById(musicId);
        if (!musicRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Bài hát không tồn tại.",
                data: null
            });
        }

        const isLiked = userRecord.likedMusic.includes(musicId);

        if (isLiked) {
            userRecord.likedMusic = userRecord.likedMusic.filter(id => id.toString() !== musicId);
            await userRecord.save();

            musicRecord.quantityLike = musicRecord.quantityLike - 1
            await musicRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Bỏ thích bài hát thành công.",
                data: null
            });
        } else {
            userRecord.likedMusic.push(musicId);
            await userRecord.save();

            musicRecord.quantityLike = musicRecord.quantityLike + 1
            await musicRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Thích bài hát thành công.",
                data: null
            });
        }

    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
};

// POST: /api/favorite/album/:albumId/:userId
module.exports.likeAlbum = async (req, res) => {
    try { 
        const { userId, albumId } = req.params;
        const userRecord = await User.findById(userId);
        if (!userRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Người dùng không tồn tại.",
                data: null
            });
        }
        
        const isPermit = await user.checkPermission(res.locals.user._id.toString(), userRecord._id.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không thể thao thác.",
                data: null
            });
        }

        const albumRecord = await Album.findById(albumId);
        if (!albumRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Album không tồn tại.",
                data: null
            });
        }

        const isLiked = userRecord.likedAlbum.includes(albumId);

        if (isLiked) {
            userRecord.likedAlbum = userRecord.likedAlbum.filter(id => id.toString() !== albumId);
            await userRecord.save();

            albumRecord.quantityLike = albumRecord.quantityLike - 1
            await albumRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "unlike",
                msg: "Bỏ thích album thành công.",
                data: null
            });
        } else {
            userRecord.likedAlbum.push(albumId);
            await userRecord.save();

            albumRecord.quantityLike = albumRecord.quantityLike + 1
            await albumRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "like",
                msg: "Thích album thành công.",
                data: null
            });
        }

    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}

// POST: /api/favorite/singer/:singerId/:userId
module.exports.subcribeSinger = async (req, res) => {
    try {
        const { userId, singerId } = req.params;
        const userRecord = await User.findById(userId);
        if (!userRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Người dùng không tồn tại.",
                data: null
            });
        }
        
        const isPermit = await user.checkPermission(res.locals.user._id.toString(), userRecord._id.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không thể thao thác.",
                data: null
            });
        }

        const singerRecord = await Singer.findById(singerId);
        if (!singerRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Ca sĩ không tồn tại.",
                data: null
            });
        }

        const isLiked = userRecord.subcribedSinger.includes(singerId);

        if (isLiked) {
            userRecord.subcribedSinger = userRecord.subcribedSinger.filter(id => id.toString() !== singerId);
            await userRecord.save();

            singerRecord.quantitySubcriber = singerRecord.quantitySubcriber - 1
            await singerRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "unlike",
                msg: "Bỏ quan tâm ca sĩ thành công.",
                data: null
            });
        } else {
            userRecord.subcribedSinger.push(singerId);
            await userRecord.save();

            singerRecord.quantitySubcriber = singerRecord.quantitySubcriber + 1
            await singerRecord.save()

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "like",
                msg: "Quan tâm ca sĩ thành công.",
                data: null
            });
        }
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}