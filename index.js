const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const cors = require('cors');
const http = require('http')
const { Server } =  require('socket.io')
require("dotenv").config()

const database = require("./config/database")
const systemRoute = require("./routes/routes.index.js");
const server = http.createServer(app)

database.connect()
const port = process.env.PORT
// const feDomain = process.env.FE_DOMAIN

const allowedOrigins = ['http://localhost:3000', 'https://9e75-2402-800-6d3e-95b-9952-1947-764b-4b36.ngrok-free.app'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
})

global._io = io

io.on("connection", (socket) => {    
    socket.on('JOIN_ROOM', (roomName) => {
        socket.join(roomName)
    });

    socket.on('LEAVE_ROOM', (roomName) => {
        socket.leave(roomName)
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true // Cho phép gửi cookies
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

systemRoute(app)

server.listen(port, () => {
    console.log("localhost:" + port);
})
