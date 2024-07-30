const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const System = require("../models/models.system.js")

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
