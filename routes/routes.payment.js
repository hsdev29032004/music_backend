const express = require("express")
const router = express.Router()
const axios = require("axios")

const authMiddlewares = require("../middlewares/middlewares.auth.js");
const { ROLE_SYSTEM } = require("../config/error.js");

router.post(
    '/',
    authMiddlewares.checkLogin,
    async () => {
        if(res.locals.user.level > 1){
            return
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
            ipnUrl: 'https://0778-14-178-58-205.ngrok-free.app/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
            requestType: 'payWithMethod',
            extraData: '',
            orderGroupId: '',
            autoCapture: true,
            lang: 'vi',
          };

        var amount = '10000';
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
            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({ statusCode: 500, message: error.message });
        }
    });

router.post('/callback', async (req, res) => {
    console.log('callback: ');
    console.log(req.body);
    return res.status(204).json(req.body);
});

module.exports = router