const mongoose = require("mongoose");

const acceptedUserSchema = new mongoose.Schema({
    accepted_userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    acceptedUser_name: {
        type: String,
        required : true
    }
}, {timestamps : true })

module.exports = mongoose.model("acceptedUser", acceptedUserSchema)