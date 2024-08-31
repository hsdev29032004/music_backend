const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    music: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Music' 
    },
    content: String,
    isCensored: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Comment = mongoose.model("Comment", CommentSchema, "comments")

module.exports = Comment