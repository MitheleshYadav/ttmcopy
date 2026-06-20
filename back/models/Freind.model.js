const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
   users : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
   ]
    
}, {timestamps : true })

module.exports = mongoose.model("Friend", friendSchema)