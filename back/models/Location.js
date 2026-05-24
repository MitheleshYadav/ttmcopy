const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    isOnline :{
        type : Boolean,
        default : true,
    }
}, {timestamps : true })

module.exports = mongoose.model("Location", locationSchema)