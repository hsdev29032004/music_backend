const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (req, res, next) => {
    try {
        let errors = {};

        if (!req.body.email) {
            errors.email = "Email chưa được nhập";
        } else {
            if (!emailRegex.test(req.body.email)) {
                errors.email = "Email không đúng định dạng";
            }
        }

        if (!req.body.password) {
            errors.password = "Password chưa được nhập";
        } else if (req.body.password.length < 6) {
            errors.password = "Password phải có ít nhất 6 ký tự";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                status: "error",
                msg: "Dữ liệu không hợp lệ",
                errors: errors
            });
        }

        next();
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống",
            data: null
        });
    }
};

const validateRegister = (req, res, next) => {
    try {
        let errors = {};

        if (!req.body.email) {
            errors.email = "Email chưa được nhập";
        } else {
            if (!emailRegex.test(req.body.email)) {
                errors.email = "Email không đúng định dạng";
            }
        }

        if (!req.body.password) {
            errors.password = "Password chưa được nhập";
        } else if (req.body.password.length < 6) {
            errors.password = "Password phải có ít nhất 6 ký tự";
        }

        if (req.body.password != req.body.repassword) {
            errors.repassword = "Password nhập lại chưa đúng";
        }

        if (!req.body.fullName) {
            errors.repassword = "Họ và tên chưa được nhập";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                status: "error",
                msg: "Dữ liệu không hợp lệ",
                errors: errors
            });
        }

        next();
    } catch (error) {
        return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống",
            data: null
        });
    }
};

module.exports = {
    validateLogin,
    validateRegister
};
