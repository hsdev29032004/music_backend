const express = require("express")
const router = express.Router()
const axios = require("axios")
const crypto = require('crypto');
const Payment = require("../models/models.payments.js")
const System = require("../models/models.system.js")
const User = require("../models/models.users.js")

const authMiddlewares = require("../middlewares/middlewares.auth.js");
const { ROLE_SYSTEM, CONFIG_MESSAGE_ERRORS } = require("../config/error.js");

router.post(
    '/',
    authMiddlewares.checkLogin,
    async (req, res, next) => {
        if (res.locals.user.level > ROLE_SYSTEM.BASIC) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Bạn đã nâng cấp rồi",
                data: null
            })
        } else {
            next()
        }
    },
    async (req, res) => {
        let {
            accessKey,
            secretKey,
            orderInfo,
            partnerCode,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            orderGroupId,
            autoCapture,
            lang,
        } = {
            accessKey: 'F8BBA842ECF85',
            secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
            orderInfo: 'pay with MoMo',
            partnerCode: 'MOMO',
            redirectUrl: 'http://localhost:3000/',
            ipnUrl: 'https://2dd6-2402-800-6d3e-95b-b4c2-8ace-1928-992a.ngrok-free.app/api/payment/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
            requestType: 'payWithMethod',
            extraData: '',
            orderGroupId: '',
            autoCapture: true,
            lang: 'vi',
        };
        const system = await System.findOne({})
        var amount = system.upgradePrice;
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        //signature
        var signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });

        // options for axios
        const options = {
            method: 'POST',
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        let result;
        try {
            result = await axios(options);
            if(result.data){
                const payment = new Payment({
                    orderId: result.data.orderId,
                    money: result.data.amount,
                    user: res.locals.user.id,
                })
                await payment.save()
            }
            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Lấy dữ liệu thanh toán thành công",
                data: result.data
            });
        } catch (error) {
            return res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({ statusCode: 500, message: error.message });
        }
    }
);

router.post('/callback', async (req, res) => {
    try {
        if(req.body?.resultCode === 0){
            const payment = await Payment.findOne({orderId: req.body.orderId})
            payment.isPaid = true
            await payment.save()
            await User.updateOne({_id: payment.user}, {level: 2})
        }
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router