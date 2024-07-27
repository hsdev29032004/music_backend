const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
require("dotenv").config()


const database = require("./config/database")
const systemRoute = require("./routes/routes.index.js")

database.connect()
const port = process.env.PORT

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

systemRoute(app)

app.listen(port, () => {
    console.log("localhost:" + port);
})
