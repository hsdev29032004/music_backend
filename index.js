const express = require("express")
const app = express()
require("dotenv").config()

const database = require("./config/database")
const systemRoute = require("./routes/routes.index.js")

const port = process.env.PORT
database.connect()

systemRoute(app)

app.listen(port, () => {
    console.log("localhost:" + port);
})
