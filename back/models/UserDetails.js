const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    profile_name : {
        type : String,
        required : true
    },
    about : {
        type : String,
        required : true
    }
}, {timestamps : true })

module.exports = mongoose.model("UserDetails", userDetailsSchema)