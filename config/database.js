const mongoose = require("mongoose")

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connect success");
    } catch (error) {
        console.log("Connect fail with error code: " + error);
    }
}