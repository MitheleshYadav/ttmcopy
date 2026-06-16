const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Conversation",
        required : true
    },
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : "string",
        required : true
    }
}, { timestamps : true })

module.exports = mongoose.model("Messages", messageSchema);