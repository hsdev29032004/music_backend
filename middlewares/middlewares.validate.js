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
                data: errors
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
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Email chưa được nhập",
                data: null
            });
        } else {
            if (!emailRegex.test(req.body.email)) {
                return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                    status: "error",
                    msg: "Email không đúng định dạng",
                    data: null
                });
            }
        }

        if (!req.body.password) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Password chưa được nhập",
                data: null
            });
        } else if (req.body.password.length < 6) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Password phải có ít nhất 6 ký tự",
                data: null
            });
        }

        if (req.body.password != req.body.repassword) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Password nhập lại chưa đúng",
                data: null
            });
        }

        if (!req.body.fullName) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Họ và tên chưa được nhập",
                data: null
            });
        }

        if (Object.keys(errors).length > 0) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Dữ liệu không hợp lệ",
                data: errors
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

const validateResetPassword = (req, res, next) => {
    try {
        let errors = {};
        if (!req.body.password ) {
            errors.password = "Password chưa được nhập";
        } else if (req.body.password.length < 6) {
            errors.password = "Password phải có ít nhất 6 ký tự";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: errors.password,
                data: null
            });
        }

        if (req.body.password != req.body.repassword){
            errors.repassword = "Mật khẩu nhập lại chưa đúng"
        }

        if (Object.keys(errors).length > 0) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: errors.repassword,
                data: null
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
}

const validateInput = (data, arrRequired) => {
    const missingFields = arrRequired.filter(
      field => !JSON.stringify(data[field])
    );
    return missingFields;
};

module.exports = {
    validateLogin,
    validateRegister,
    validateInput,
    validateResetPassword
};
