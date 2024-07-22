const homeRoute = require("./routes.test.js")

module.exports = (app) => {
    app.use("/", homeRoute)
}