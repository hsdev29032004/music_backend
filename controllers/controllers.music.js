const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js");
const Music = require("../models/models.musics.js");
const Playlist = require("../models/models.playlists.js");
const user = require("../helper/user.js")
const { addImage, addMp3} = require("../helper/cloudinary.js")
const slugHelper = require("../helper/slug.js");
const { getLyrics } = require("../helper/crawlLyricsApi.js");
const Singer = require("../models/models.singers.js");

// GET: /api/music?keyword=
module.exports.getListMusic = async (req, res) => {
    try {
        let keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i");
        let regexLyric = new RegExp(req.query.keyword, "i");

        const nameResults = await Music.find({ slug: keyword, deleted: false })
            .populate({
                path: "singerId",
                select: "fullName slug"
            })
            .populate({
                path: "otherSingersId",
                select: "fullName slug"
            })
            .select("name slug avatar premium")

        const lyricsResults = await Music.find({ lyrics: regexLyric, deleted: false })
            .populate({
                path: "singerId",
                select: "fullName slug"
            })
            .populate({
                path: "otherSingersId",
                select: "fullName slug"
            })
            .select("name slug avatar")

        const allResults = [...nameResults, ...lyricsResults];
        const uniqueResults = allResults.reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) acc.push(current);
            return acc;
        }, []);

        const isPremium = await user.checkPremium(req, res);

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
            .populate({
                path: "singerId",
                select: "fullName slug"
            })
            .populate({
                path: "otherSingersId",
                select: "fullName slug"
            })

        const isPremium = await user.checkPremium(req, res);

        if(!isPremium && music?.premium){
            music.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a"
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
        if (!req.files?.avatar || !req.files?.avatar[0]) {
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
        const { name, lyrics, description, singerId, otherSingersId, musicType, premium } = req.body;
        if(!name || !lyrics || !singerId){
            res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa được nhập",
                data: null
            })
        }
        try {
            const singerRecord = await Singer.findById(singerId)
            if(!singerRecord){
                return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                    status: "error",
                    msg: "Không tồn tại ca sĩ",
                    data: nul
                })
            }
        } catch (error) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không tồn tại ca sĩ",
                data: nul
            })
        }
        const arrOtherSingerIds = otherSingersId ? otherSingersId.split(',').map(id => id.trim()) : []
        const arrMusicType = musicType ? musicType.split(',').map(id => id.trim()) : []
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
            musicType: arrMusicType,
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
            msg: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// PATCH: /api/music/edit/:id
module.exports.editMusic = async (req, res) => {
    try {
        const { name, lyrics, description, otherSingersId, album, premium } = req.body;        

        if (!name.trim() || !lyrics.trim()) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa được nhập",
                data: null
            });
        }

        let newMusic = {
            name,
            lyrics,
            premium: premium || false,
            otherSingersId: otherSingersId || [],
            description: description || "",
        };

        if(album ){
            newMusic.album = album
        }        

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

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
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

// GET: /api/music/zingmp3/crawl-lyrics?name=
module.exports.crawlLyrics = async (req, res) => {
    try {
        if(!req.query.name){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                message: 'Chưa nhập tên bài hát.',
                data: null
            }); 
        }
        const objectLyrics = await getLyrics(req.query.name)

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json(objectLyrics)
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Không có bài hát hoặc lỗi hệ thống, vui lòng thử lại sau.',
            data: error.message
        });
    }
}

// POST: /api/music/add/toPlaylist
module.exports.addToPlaylist = async (req, res) => {
    try {
        const { musicId, playlistId } = req.body;
        const arrMusicId = musicId ? musicId.split(',').map(id => id.trim()) : [];
        const playlistRecord = await Playlist.findById(playlistId);
        if (!playlistRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Playlist không tồn tại.",
                data: null
            });
        }

        const isPermit = await user.checkPermission(res.locals.user._id.toString(), playlistRecord.userId.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không thể thao thác.",
                data: null
            });
        }

        for (const id of arrMusicId) {
            try {
                const musicRecord = await Music.findById(id);
                if (!musicRecord) {
                    continue;
                }

                if (!playlistRecord.music.includes(id)) {
                    playlistRecord.music.push(id);
                }
            } catch (error) {
                continue
            }
        }
        await playlistRecord.save();

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Thêm bài hát vào playlist thành công.",
            data: null
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// PATCH: /api/music/deleteFromPlaylist
module.exports.deleteFromPlaylist = async (req, res) => {
    try {
        const { musicId, playlistId } = req.body;
        const arrMusicId = musicId ? musicId.split(',').map(id => id.trim()) : [];

        const playlistRecord = await Playlist.findById(playlistId);
        if (!playlistRecord) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Playlist không tồn tại.",
                data: null
            });
        }

        const isPermit = await user.checkPermission(res.locals.user._id.toString(), playlistRecord.userId.toString());
        if (!isPermit) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Không thể thao thác.",
                data: null
            });
        }

        for (const id of arrMusicId) {
            try {
                const musicRecord = await Music.findById(id);
                if (!musicRecord) {
                    continue;
                }

                if (playlistRecord.music.includes(id)) {
                    playlistRecord.music = playlistRecord.music.filter(playlistId => playlistId.toString() !== id);
                }
            } catch (error) {
                continue
            }
        }

        await playlistRecord.save();

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Xóa bài hát khỏi playlist thành công.",
            data: null
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// GET: /api/music/get/rank
module.exports.getRank = async (req, res) => {    
    try {
        const musics = await Music.find({deleted: false})
            .populate({
                path: "singerId",
                select: "fullName slug"
            })
            .populate({
                path: "otherSingersId",
                select: "fullName slug"
            })
            .select("name slug avatar premium quantityLike")
        let k = Math.min(20, musics.length);
        
        let result = []
        for (let i = 0; i < k; i++) {
            let maxIndex = 0;
            for (let j = 1; j < musics.length; j++) {
                if (musics[j].quantityLike > musics[maxIndex].quantityLike) {
                    maxIndex = j;
                }
            }
            result.push(musics[maxIndex]);
            musics.splice(maxIndex, 1);
        }

        const isPremium = await user.checkPremium(req, res);

        if(!isPremium){
            result.forEach(item => {
                if(item.premium){
                    item.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a"
                }
            })
        }

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy dữ liệu thành công",
            data: result
        })
    } catch (error) {        
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}