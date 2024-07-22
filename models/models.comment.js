const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    userId: String,
    musicId: String,
    content: String,
},{
    timestamps: true
})

const Comment = mongoose.model("Comment", CommentSchema, "comments")

module.exports = Comment