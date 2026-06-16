const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    ],
    lastMessage : {
        type : "String",
        default : ""
    }
}, { timestamps : true });


//Create an index on the participants field so MongoDB can find conversations by participant (user ID) faster.
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);