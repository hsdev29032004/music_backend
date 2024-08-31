const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const System = require("../models/models.system.js")
const Singer = require("../models/models.singers.js")
const User = require("../models/models.users.js")
const Music = require("../models/models.musics.js")
const Album = require("../models/models.albums.js")

// GET: /api/system
module.exports.systemGet = async (req, res) => {
    try {
        const system = await System.findOne({})
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy dữ liệu thành công",
            data: system
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        })
    }
}

// PATCH: /api/system
module.exports.systemPatch = async (req, res) => {
    try {
        const { siteName, footer, upgradePrice, momo, logo, logoFold, maintenanceMode } = req.body;
        if(!siteName || !footer || !upgradePrice || !momo || !logo || !logoFold || maintenanceMode === undefined){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa nhập",
                data: req.body
            })
        }
        const system = await System.findOne({});
        if (system) {
            await System.updateOne({}, {
                siteName,
                footer,
                upgradePrice: parseInt(upgradePrice),
                momo,
                logo,
                logoFold,
                maintenanceMode
            });
        } else {
            const newSystem = new System({
                siteName,
                footer,
                upgradePrice: parseInt(upgradePrice),
                momo,
                logo,
                logoFold,
                maintenanceMode
            });
            await newSystem.save();
        }
        
        const newData = await System.findOne({});

        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Cập nhật hệ thống thành công",
            data: newData
        });
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: null
        });
    }
};

module.exports.systemInfo = async (req, res) => {
    try {
        const albums = await Album.countDocuments({})
        const singers = await Singer.countDocuments({})
        const users = await User.countDocuments({})
        const vipUsers = await User.countDocuments({level: 2})
        const basicUsers = users - vipUsers
        const musics = await Music.countDocuments({})
        const premiumMusics = await Music.countDocuments({premium: true})
        const basicMusics = musics - premiumMusics

        const result = {
            quantityAlbum: albums,
            quantityMusic: {
                premium: premiumMusics,
                basic: basicMusics,
                total: musics
            },
            quantityUser: {
                vip: vipUsers,
                basic: basicUsers,
                total: users
            },
            quantitySinger: singers
        }

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy dữ liệu thành công",
            data: result
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error.message
        });
    }
}