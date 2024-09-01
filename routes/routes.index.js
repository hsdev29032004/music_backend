const albumRoute = require("./routes.album.js")
const authRoute = require("./routes.auth.js")
const commentRoute = require("./routes.comment.js")
const forgotPasswordRoute = require("./routes.forgotPassword.js")
const musicRoute = require("./routes.music.js")
const musicTypeRoute = require("./routes.musicType.js")
const playlistRoute = require("./routes.playlist.js")
const singerRoute = require("./routes.singer.js")
const systemRoute = require("./routes.system.js")
const userRoute = require("./routes.user.js")
const favoriteRoute = require("./routes.favorite.js")
const paymentRoute = require("./routes.payment.js")

module.exports = (app) => {
    app.use("/api/album", albumRoute)
    app.use("/api/auth", authRoute)
    app.use("/api/comment", commentRoute)
    app.use("/api/forgot-password", forgotPasswordRoute)
    app.use("/api/music", musicRoute)
    app.use("/api/music-type", musicTypeRoute)
    app.use("/api/playlist", playlistRoute)
    app.use("/api/singer", singerRoute)
    app.use("/api/system", systemRoute)
    app.use("/api/user", userRoute)
    app.use("/api/favorite", favoriteRoute)
    app.use("/api/payment", paymentRoute)
}