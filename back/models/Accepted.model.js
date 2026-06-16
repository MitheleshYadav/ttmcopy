const mongoose = require("mongoose");

const acceptedUserSchema = new mongoose.Schema({
    sender_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    sender_name : {
        type : "string",
        required : true,
    }
    
}, {timestamps : true })

module.exports = mongoose.model("acceptedUser", acceptedUserSchema)