const mongoose = require("mongoose");

const requestDetailsSchema = new mongoose.Schema({
    sender_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message : {
        type : String,
        default : "Hi, i would like to connet with you"
    },
    status:{
        type : String,
        enum : ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {timestamps : true })

module.exports = mongoose.model("requestDetails", requestDetailsSchema)