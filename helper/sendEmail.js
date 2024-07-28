const nodemailer = require('nodemailer');

const sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        tls: {
            rejectUnauthorized: false
        },
        service: "gmail",
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: email,
        subject: subject,
        html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = {
    sendMail
}