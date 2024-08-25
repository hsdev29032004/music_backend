const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const cors = require('cors');
require("dotenv").config()

const database = require("./config/database")
const systemRoute = require("./routes/routes.index.js")

database.connect()
const port = process.env.PORT

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Cho phép gửi cookies
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

systemRoute(app)

app.listen(port, () => {
    console.log("localhost:" + port);
})
